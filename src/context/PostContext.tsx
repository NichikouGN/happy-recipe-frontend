//Tanstack
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";

//React
import {
  useContext,
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useRef,
} from "react";

//Context
import { useAuthContext } from "./AuthContext";
import { useToastContext } from "./ToastContext";

//Types
import type {
  ActionPayload,
  FullPostStructure,
  PostStructure,
  ReactionType,
} from "../types/PostType";

//API & Hooks
import { fetchDetailedPost, fetchPosts, uploadUserAction } from "../api/posts";
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
      useDetailedPost: (postID: string) => UseQueryResult<FullPostStructure>;
      handleUserReaction: (
        sourcePost: string,
        newReaction: ReactionType
      ) => void;
      handleUserBookmark: (sourcePost: string, newBookmark: boolean) => void;
    }
  | undefined
>(undefined);

export const PostProvider: FC<{ children: ReactNode }> = ({ children }) => {
  //Tanstack
  const queryClient = useQueryClient();
  const { Toast } = useToastContext();

  const { accessToken, requestNewAccessToken } = useAuthContext(); // Assuming access token logic
  const pendingMutation = useRef<Set<string>>(new Set());
  const discoverScrollY = useRef<number>(0);

  /**
   * Function for tanstack useMutation()
   * @param { action, postID, newReaction, newBookmark } ActionPayload type of action , new reaction or bookmark state and postID
   */
  const confirmUserAction = useCallback(
    async ({ action, postID, newReaction, newBookmark }: ActionPayload) => {
      if (!accessToken) {
        Toast({
          type: "error",
          title: "Authentication Error",
          message: "Please sign in to react to the post",
        });

        return;
      }

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);

      try {
        await uploadUserAction(accessToken, controller, {
          action,
          postID,
          newReaction,
          newBookmark,
        });
      } catch (e) {
        // Refresh token and retry again
        const updatedToken = await requestNewAccessToken();
        try {
          await uploadUserAction(updatedToken, controller, {
            action,
            postID,
            newReaction,
            newBookmark,
          });
        } catch (e) {
          // Final error toast
          Toast({
            type: "error",
            title: "Action Failed",
            message: "Unable to complete your action. Please try again later.",
          });
        }
      } finally {
        clearTimeout(id);
      }
    },
    [accessToken, requestNewAccessToken]
  );

  /**
   * useInfiniteQuery hook to fetch posts for discovery feed
   */
  const { data, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["discoverPosts"],
      queryFn: fetchPosts,

      initialPageParam: 1, // Start page
      getNextPageParam: (lastPage) => lastPage.nextPage,

      staleTime: 1000 * 60 * 5, // Refresh data every 5 mins
    });

  //Flatten postList
  const postList: PostStructure[] = data
    ? data.pages.flatMap((page) => page.posts)
    : [];

  //Query hook for detailed post
  const useDetailedPost = (postID: string) => {
    return useQuery({
      queryKey: ["detailedPost", postID],
      queryFn: fetchDetailedPost,
      enabled: !!postID,
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
        postID: sourcePost,
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
  const handleUserBookmark = useCallback(
    (sourcePost: string, newBookmark: boolean) => {
      // Trigger the mutation hook
      if (pendingMutation.current.has(sourcePost)) return;

      pendingMutation.current.add(sourcePost);

      bookMarkMutation.mutate({
        action: "bookmark",
        postID: sourcePost,
        newBookmark: newBookmark,
      });
    },
    []
  );

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
