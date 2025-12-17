//Tanstack
import { useInfiniteQuery, useQuery, type UseQueryResult } from "@tanstack/react-query";

import { queryClient } from "../queryClient";

//React
import { useContext, createContext, type FC, type ReactNode, useCallback, useRef } from "react";

import { useToastStore } from "../stores/toastStore";

//Types
import type { FullPostStructure, PostStructure, ReactionType } from "../types/PostType";

//API & Hooks
import { fetchDetailedPost, fetchPosts, confirmUserAction } from "../api/posts";
import { useReactionMutation } from "../hooks/useReactionMutation";
import { useBookMarkMutation } from "../hooks/useBookMarkMutation";

//Create Post Context
const PostContext = createContext<
  | {
      discoverScrollY: React.RefObject<number>;
      postList: PostStructure[]; // The data object from useInfiniteQuery
      isLoading: boolean; // Init state
      isFetchingNextPage: boolean; // Fetching state
      fetchNextPage: () => void;
      useDetailedPost: (postId: string) => UseQueryResult<FullPostStructure>;
      handleUserReaction: (sourcePost: string, newReaction: ReactionType) => void;
      handleUserBookmark: (sourcePost: string, newBookmark: boolean) => void;
    }
  | undefined
>(undefined);

export const PostProvider: FC<{ children: ReactNode }> = ({ children }) => {
  //Tanstack
  const Toast = useToastStore((state) => state.Toast);

  const pendingMutation = useRef<Set<string>>(new Set());
  const discoverScrollY = useRef<number>(0);

  /**
   * useInfiniteQuery hook to fetch posts for discovery feed
   */
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["discoverPosts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),

    initialPageParam: 1, // Start page
    getNextPageParam: (lastPage) => lastPage.nextPage,

    staleTime: 1000 * 60 * 5, // Refresh data every 5 mins
  });

  //Flatten postList
  const postList: PostStructure[] = data ? data.pages.flatMap((page) => page.posts) : [];

  //Query hook for detailed post
  const useDetailedPost = (postId: string) => {
    return useQuery({
      queryKey: ["detailedPost", postId],
      queryFn: fetchDetailedPost,
      enabled: !!postId,
    });
  };

  //Mutation hook for user reactions
  const reactionMutation = useReactionMutation({
    queryClient,
    confirmUserAction,
    Toast,
    pendingMutation,
  });

  /**
   * Handle user reaction to a post
   *
   * @param sourcePost The ID of the post being reacted to
   * @param newReaction The new reaction type
   */
  const handleUserReaction = useCallback(
    (sourcePost: string, newReaction: ReactionType) => {
      // Trigger the mutation hook
      if (pendingMutation.current.has(sourcePost)) return;

      pendingMutation.current.add(sourcePost);

      reactionMutation.mutate({
        action: "reaction",
        postId: sourcePost,
        newReaction: newReaction,
      });
    },
    [reactionMutation, pendingMutation]
  );

  //Mutation hook for user bookmark
  const bookMarkMutation = useBookMarkMutation({
    queryClient,
    confirmUserAction,
    Toast,
    pendingMutation,
  });

  /**
   * Handle user bookmark action
   *
   * @param sourcePost The ID of the post being bookmarked
   * @param newBookmark The new bookmark state
   */
  const handleUserBookmark = useCallback((sourcePost: string, newBookmark: boolean) => {
    // Trigger the mutation hook
    if (pendingMutation.current.has(sourcePost)) return;

    pendingMutation.current.add(sourcePost);

    bookMarkMutation.mutate({
      action: "bookmark",
      postId: sourcePost,
      newBookmark: newBookmark,
    });
  }, []);

  return (
    <PostContext.Provider
      value={{
        discoverScrollY,
        postList,
        isLoading,
        isFetchingNextPage,
        useDetailedPost,
        fetchNextPage,
        handleUserReaction,
        handleUserBookmark,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("Error");
  }

  return context;
};
