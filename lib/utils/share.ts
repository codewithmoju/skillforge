// Share utility functions

export const sharePost = (postId: string): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/post/${postId}`;
};

export const shareRoadmap = (roadmapId: string): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/roadmap/${roadmapId}`;
};

export const shareAchievement = (achievementId: string): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/achievement/${achievementId}`;
};

export const shareProfile = (username: string): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/profile/${username}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

export const shareToTwitter = (text: string, url: string) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
};

export const shareToFacebook = (url: string) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
};

export const shareToLinkedIn = (url: string) => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
};

export const shareViaWebShare = async (title: string, text: string, url: string): Promise<boolean> => {
    if (navigator.share) {
        try {
            await navigator.share({
                title,
                text,
                url,
            });
            return true;
        } catch (err) {
            console.error('Error sharing:', err);
            return false;
        }
    }
    return false;
};
