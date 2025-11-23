//Tanstack
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryFunction,
  type UseQueryResult,
} from "@tanstack/react-query";

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

//Interfaces
export interface Reaction {
  like: number;
  heart: number;
  yum: number;
}
type ReactionType = "like" | "heart" | "yum";

export interface UserActions {
  userReaction: ReactionType | null;
  userBookmark: boolean;
}

export interface PostStructure {
  postID: string;
  title: string;
  coverImgURL: string;
  authorID: number;
  authorName: string;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  reactions: Reaction;
  userActions: UserActions;
}

export interface FullPostStructure extends PostStructure {
  description: string;
  steps: [
    {
      stepNum: number;
      stepDesc: string;
    }
  ];
}

/**
 * fetcher functions for tanstack useInfiniteQuery()
 * @param pageParam
 * @returns a posts object with a nextPage cursor`
 */
const fetchPosts: QueryFunction<
  { posts: PostStructure[]; nextPage: number | undefined },
  [string],
  number
> = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `http://${import.meta.env.VITE_API_URL}:4000/discover?page=${pageParam}`
  );

  if (!res.ok) throw new Error("Failed to fetch posts");

  const data = await res.json();
  const newPosts: PostStructure[] = data.postList; //Retrieve the list

  return {
    posts: newPosts,
    nextPage: pageParam + 1,
  };
};

const uploadUserAction = async (
  accessToken: string,
  controller: AbortController,
  { action, postID, newReaction, newBookmark }: ActionPayload
) => {
  // Implement token logic here if needed, or get token outside the function
  const body =
    action === "reaction"
      ? JSON.stringify({ reaction: newReaction, postID })
      : JSON.stringify({ bookmark: newBookmark, postID });

  // Use your actual endpoint and token logic
  const res = await fetch(
    `http://${import.meta.env.VITE_API_URL}:4000/${action}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: body,
      signal: controller.signal,
    }
  );

  if (!res.ok) throw new Error("Action failed");
};

interface ActionPayload {
  action: "reaction" | "bookmark";
  postID: string;
  newReaction?: ReactionType;
  newBookmark?: boolean;
}

interface PostContextType {
  postList: PostStructure[]; // The data object from useInfiniteQuery
  isLoading: boolean; // Init state
  isFetchingNextPage: boolean; // Fetching state
  fetchNextPage: () => void;
  useDetailedPost: (postID: string) => UseQueryResult<FullPostStructure>;
  handleUserReaction: (sourcePost: string, newReaction: ReactionType) => void;
  handleUserBookmark: (sourcePost: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { Toast } = useToastContext();
  const { accessToken, requestNewAccessToken } = useAuthContext(); // Assuming access token logic
  const pendingMutation = useRef<Set<string>>(new Set());

  const fetchDetailedPost: QueryFunction<
    FullPostStructure,
    [string, string]
  > = async ({ queryKey }) => {
    const [, postID] = queryKey;
    const res = await fetch(
      `http://${import.meta.env.VITE_API_URL}:4000/post?id=${postID}`
    );

    if (!res.ok) throw new Error("Failed to fetch posts");

    const data = await res.json();
    const detailedPost: FullPostStructure = data.post; //Retrieve the list

    return detailedPost;
  };

  /**
   * Function for tanstack useMutation()
   * @param ActionPayLoad
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
        uploadUserAction(accessToken, controller, {
          action,
          postID,
          newReaction,
          newBookmark,
        });
      } catch (e) {
        const updatedToken = await requestNewAccessToken();
        try {
          uploadUserAction(updatedToken, controller, {
            action,
            postID,
            newReaction,
            newBookmark,
          });
        } catch (e) {}
      } finally {
        clearTimeout(id);
      }
    },
    [accessToken, requestNewAccessToken]
  );

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

  const useDetailedPost = (postID: string) => {
    return useQuery({
      queryKey: ["detailedPost", postID],
      queryFn: fetchDetailedPost,
      enabled: !!postID,
    });
  };

  //Mutation hooks
  const reactionMutation = useMutation<
    void,
    Error,
    ActionPayload,
    {
      previousPosts: unknown;
      previousDetailedPost: FullPostStructure | undefined;
    }
  >({
    mutationFn: (payload: ActionPayload) => confirmUserAction(payload),

    onMutate: async (newAction) => {
      // Cancel current query to prevent overwritting
      await queryClient.cancelQueries({ queryKey: ["discoverPosts"] });

      // Store the previous value
      const previousPosts = queryClient.getQueryData(["discoverPosts"]);
      const previousDetailedPost = queryClient.getQueryData<FullPostStructure>([
        "detailedPost",
      ]);

      queryClient.setQueryData(["detailedPost"], (oldData: any) => {
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
      });

      // Update the list
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

      // Return the previous value so it can be used
      // in case of an error
      return { previousPosts, previousDetailedPost };
    },

    // If the mutation fails, rollback
    onError: (err, _, context) => {
      Toast({
        type: "error",
        title: err.name,
        message: err.message,
      });

      if (context?.previousPosts) {
        queryClient.setQueryData(["discoverPosts"], context.previousPosts);
      }
    },

    // Refetch data to make sure its in sync
    onSettled: (_, __, variables) => {
      pendingMutation.current.delete(variables.postID);
      queryClient.invalidateQueries({ queryKey: ["discoverPosts"] });
    },
  });

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

  const bookMarkMutation = useMutation<
    void,
    Error,
    ActionPayload,
    {
      previousPosts: unknown;
    }
  >({
    mutationFn: (payload: ActionPayload) => confirmUserAction(payload),

    // Optimistic Update: runs before the server call
    onMutate: async (newAction) => {
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["discoverPosts"] });

      // 2. Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["discoverPosts"]);

      // 3. Optimistically update the cache
      queryClient.setQueryData(["discoverPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        // Find and update the specific post within the pages structure
        const updatedPages = oldData.pages.map(
          (page: { posts: PostStructure[] }) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (
                post.postID !== newAction.postID ||
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

      // 4. Return the snapshot so we can use it on error
      return { previousPosts };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, _, context) => {
      Toast({
        type: "error",
        title: err.name,
        message: err.message,
      });
      // Rollback to the previous state
      if (context?.previousPosts) {
        queryClient.setQueryData(["discoverPosts"], context.previousPosts);
      }
    },

    // Always refetch after error or success to ensure data is in sync
    onSettled: (_, __, variables) => {
      pendingMutation.current.delete(variables.postID);
      queryClient.invalidateQueries({ queryKey: ["discoverPosts"] });
    },
  });

  const handleUserBookmark = useCallback((sourcePost: string) => {
    // Trigger the mutation hook
    if (pendingMutation.current.has(sourcePost)) return;

    pendingMutation.current.add(sourcePost);

    bookMarkMutation.mutate({
      action: "bookmark",
      postID: sourcePost,
    });
  }, []);

  const contextValue: PostContextType = {
    postList,
    isLoading,
    isFetchingNextPage,
    useDetailedPost,
    fetchNextPage,
    handleUserReaction,
    handleUserBookmark,
  };

  return (
    <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("Error");
  }

  return context;
};
