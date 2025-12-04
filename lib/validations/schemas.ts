import { z } from "zod";

export const profileSchema = z.object({
    displayName: z.string().min(2, "Display name must be at least 2 characters").max(50, "Display name must be less than 50 characters"),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    location: z.string().max(50, "Location must be less than 50 characters").optional(),
});

export const postSchema = z.object({
    content: z.string().min(1, "Post content cannot be empty").max(2000, "Post content must be less than 2000 characters"),
    images: z.array(z.string().url()).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type PostFormData = z.infer<typeof postSchema>;
