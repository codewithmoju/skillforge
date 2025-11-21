import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Validates an image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Please upload a JPEG, PNG, or WebP image' };
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return { valid: false, error: 'Image must be less than 5MB' };
    }

    return { valid: true };
}

/**
 * Compresses an image file before upload
 */
export async function compressImage(file: File, maxSizeMB: number = 1): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions (max 1024px)
                const maxDimension = 1024;
                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    0.8 // Quality (0-1)
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
    });
}

/**
 * Uploads a profile picture to Firebase Storage
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns The download URL of the uploaded image
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // Compress image
        const compressedFile = await compressImage(file);

        // Create a reference to the file location
        const timestamp = Date.now();
        const fileName = `profile-pictures/${userId}/${timestamp}.jpg`;
        const storageRef = ref(storage, fileName);

        // Upload file
        await uploadBytes(storageRef, compressedFile);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: any) {
        console.error('Error uploading profile picture:', error);
        throw new Error(error.message || 'Failed to upload profile picture');
    }
}

/**
 * Deletes a profile picture from Firebase Storage
 * @param userId - The user's ID
 * @param pictureUrl - The URL of the picture to delete
 */
export async function deleteProfilePicture(userId: string, pictureUrl: string): Promise<void> {
    try {
        // Extract file path from URL
        const url = new URL(pictureUrl);
        const pathMatch = url.pathname.match(/profile-pictures\/.+/);

        if (!pathMatch) {
            throw new Error('Invalid profile picture URL');
        }

        const filePath = decodeURIComponent(pathMatch[0]);
        const storageRef = ref(storage, filePath);

        // Delete file
        await deleteObject(storageRef);
    } catch (error: any) {
        console.error('Error deleting profile picture:', error);
        throw new Error(error.message || 'Failed to delete profile picture');
    }
}

/**
 * Generates a default avatar URL from username initials
 * @param username - The username
 * @returns A URL to a generated avatar
 */
export function generateDefaultAvatar(username: string): string {
    const initials = username.substring(0, 2).toUpperCase();
    // Using UI Avatars API for default avatars
    return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff&size=256&bold=true`;
}
