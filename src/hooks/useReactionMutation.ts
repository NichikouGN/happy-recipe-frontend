import { QueryClient, useMutation } from "@tanstack/react-query";
import type {
  ActionPayload,
  FullPostStructure,
  PostStructure,
  ReactionType,
} from "../types/PostType";

export const useReactionMutation = ({
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
     * Optimistically update the cache with the new reaction before the mutation completes
     *
     * @param newAction The new action payload containing postID and newReaction
     * @returns The previous posts and detailed post data for rollback in case of error
     */
    onMutate: async (newAction) => {
      // Cancel current query to prevent overwritting
      await queryClient.cancelQueries({ queryKey: ["discoverPosts"] });
      await queryClient.cancelQueries({
        queryKey: ["detailedPost", newAction.postID],
      });

      // Store the previous value
      const previousPosts = queryClient.getQueryData(["discoverPosts"]);
      const previousDetailedPost = queryClient.getQueryData<FullPostStructure>([
        "detailedPost",
      ]);

      // Update the detailed post
      queryClient.setQueryData(
        ["detailedPost", newAction.postID],
        (oldData: any) => {
          if (!oldData) return oldData;

          const oldUserReaction = oldData.userActions.userReaction;
          let newReactions = { ...oldData.reactions };
          let newUserReaction: ReactionType | null = newAction.newReaction!;

          if (oldUserReaction === newAction.newReaction) {
            newReactions[newAction.newReaction!] -= 1;
            newUserReaction = null;
          } else {
            if (oldUserReaction) newReactions[oldUserReaction] -= 1;
            newReactions[newAction.newReaction!] += 1;
          }

          return {
            ...oldData,
            reactions: newReactions,
            userActions: {
              ...oldData.userActions,
              userReaction: newUserReaction,
            },
          };
        }
      );

      // Update the discover posts list
      queryClient.setQueryData(["discoverPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map(
          (page: { posts: PostStructure[] }) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (
                post.postID !== newAction.postID ||
                newAction.action !== "reaction"
              )
                return post;

              const oldUserReaction = post.userActions.userReaction;
              let newReactions = { ...post.reactions };
              let newUserReaction: ReactionType | null = newAction.newReaction!;

              if (oldUserReaction === newAction.newReaction) {
                newReactions[newAction.newReaction!] -= 1;
                newUserReaction = null;
              } else {
                if (oldUserReaction) newReactions[oldUserReaction] -= 1;
                newReactions[newAction.newReaction!] += 1;
              }

              return {
                ...post,
                reactions: newReactions,
                userActions: {
                  ...post.userActions,
                  userReaction: newUserReaction,
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
          ["detailedPost", variables.postID],
          context.previousDetailedPost
        );
      }
    },

    // After mutation, refetch to sync data
    onSettled: (_, __, variables) => {
      pendingMutation.current.delete(variables.postID);
      queryClient.invalidateQueries({ queryKey: ["discoverPosts"] });
      queryClient.invalidateQueries({
        queryKey: ["detailedPost", variables.postID],
      });
    },
  });
};
