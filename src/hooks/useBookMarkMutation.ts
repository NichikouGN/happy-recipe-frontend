import { QueryClient, useMutation } from "@tanstack/react-query";
import type {
  ActionPayload,
  FullPostStructure,
  PostStructure,
} from "../types/PostType";

export const useBookMarkMutation = ({
  queryClient,
  confirmUserAction,
  Toast,
  pendingMutation,
}: {
  queryClient: QueryClient;
  confirmUserAction: (payload: ActionPayload) => Promise<void>;
  Toast: any;
  pendingMutation: React.RefObject<Set<string>>;
}) => {
  return useMutation<
    void,
    Error,
    ActionPayload,
    {
      previousPosts: unknown;
      previousDetailedPost: FullPostStructure | undefined;
    }
  >({
    // Function to perform the mutation
    mutationFn: (payload: ActionPayload) => confirmUserAction(payload),

    /**
     * Handle user bookmark action with optimistic update
     * @param newAction The new action payload containing postId and newBookmark
     * @returns The previous posts and detailed post data for rollback in case of error
     */
    onMutate: async (newAction) => {
      // Cancel current query to prevent overwritting
      await queryClient.cancelQueries({ queryKey: ["discoverPosts"] });
      await queryClient.cancelQueries({ queryKey: ["detailedPost"] });

      // Store the previous value
      const previousPosts = queryClient.getQueryData(["discoverPosts"]);
      const previousDetailedPost = queryClient.getQueryData<FullPostStructure>([
        "detailedPost",
        newAction.postId,
      ]);

      // Update the detailed post
      queryClient.setQueryData(
        ["detailedPost", newAction.postId],
        (oldData: any) => {
          if (!oldData) return oldData;

          const oldBookmark = oldData.userActions.userBookmark;
          const newBookmark = !oldBookmark;
          const newUserActions = {
            ...oldData.userActions,
            userBookmark: newBookmark,
          };

          return { ...oldData, userActions: newUserActions };
        }
      );

      // Update the discover posts list
      queryClient.setQueryData(["discoverPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        // Find and update the specific post within the pages structure
        const updatedPages = oldData.pages.map(
          (page: { posts: PostStructure[] }) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (
                post.postId !== newAction.postId ||
                newAction.action !== "bookmark"
              )
                return post;

              const oldBookmark = post.userActions.userBookmark;
              const newBookmark = !oldBookmark;

              return {
                ...post,
                userActions: {
                  ...post.userActions,
                  userBookmark: newBookmark,
                },
              };
            }),
          })
        );

        return { ...oldData, pages: updatedPages };
      });

      // Return previous data for rollback
      return { previousPosts, previousDetailedPost };
    },

    // If the mutation fails, rollback
    onError: (err, variables, context) => {
      Toast({
        type: "error",
        title: err.name,
        message: err.message,
      });

      if (context?.previousPosts) {
        queryClient.setQueryData(["discoverPosts"], context.previousPosts);
      }

      if (context?.previousDetailedPost) {
        queryClient.setQueryData(
          ["detailedPost", variables.postId],
          context.previousDetailedPost
        );
      }
    },

    // Always refetch after error or success to ensure data is in sync
    onSettled: (_, __, variables) => {
      pendingMutation.current.delete(variables.postId);
      queryClient.invalidateQueries({ queryKey: ["discoverPosts"] });
      queryClient.invalidateQueries({
        queryKey: ["detailedPost", variables.postId],
      });
    },
  });
};
