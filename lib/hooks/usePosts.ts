import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeedPostsPaginated, getAllPostsPaginated, createPost, deletePost, likePost, savePost, Post } from "../services/posts";
import { getFollowing } from "../services/follow";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function usePosts(mode: "feed" | "all" = "feed") {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ["posts", mode, user?.uid],
        queryFn: async ({ pageParam }) => {
            if (mode === "feed" && user) {
                // For feed, we need following IDs first
                // Ideally this should be cached or passed in, but for now we fetch it
                // Optimization: fetch following IDs in a separate query and pass to this one
                const followingIds = await getFollowing(user.uid);
                const allIds = [user.uid, ...followingIds];
                return getFeedPostsPaginated(allIds, 10, pageParam as any);
            } else {
                return getAllPostsPaginated(10, pageParam as any);
            }
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.lastDoc || undefined,
        enabled: mode === "all" || !!user,
    });

    const createPostMutation = useMutation({
        mutationFn: async (postData: any) => {
            if (!user) throw new Error("User not authenticated");
            return createPost(user.uid, user.displayName || "User", user.displayName || "User", user.photoURL || undefined, postData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post created successfully");
        },
        onError: (error) => {
            console.error("Error creating post:", error);
            toast.error("Failed to create post");
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            if (!user) throw new Error("User not authenticated");
            return deletePost(postId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post deleted");
        },
        onError: (error) => {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        }
    });

    const likePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            if (!user) throw new Error("User not authenticated");
            return likePost(user.uid, postId);
        },
        onMutate: async (postId) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            const previousPosts = queryClient.getQueryData(["posts", mode, user?.uid]);

            queryClient.setQueryData(["posts", mode, user?.uid], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((post: Post) => {
                            if (post.id === postId) {
                                // This is a simplified toggle logic, actual state might need checking 'isLiked'
                                // But since we don't have 'isLiked' in the post object itself (it's separate), 
                                // we can't perfectly optimistically update the count without knowing the current state.
                                // For now, we'll just invalidate on success.
                                return post;
                            }
                            return post;
                        })
                    }))
                };
            });

            return { previousPosts };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(["posts", mode, user?.uid], context?.previousPosts);
            toast.error("Failed to like post");
        }
    });

    return {
        posts: data?.pages.flatMap(page => page.items) || [],
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        createPost: createPostMutation.mutate,
        deletePost: deletePostMutation.mutate,
        likePost: likePostMutation.mutate,
        isCreating: createPostMutation.isPending,
    };
}
