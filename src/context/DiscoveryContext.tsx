import {
  useState,
  useContext,
  createContext,
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
} from "react";
import { useAuthContext } from "./AuthContext";

interface postStructure {
  postID: string;
  title: string;

  authorID: number;
  authorName: string;

  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";

  coverImageURL: string;

  reactions: { like: number; heart: number; yum: number };

  userReaction: "like" | "heart" | "yum" | "";
  userBookmark: boolean;
}

const DiscoveryContext = createContext<
  | {
      page: number;
      postList: postStructure[];
      loadState: "loading" | "loaded";
      scrollY: number;
      setScrollY: Dispatch<SetStateAction<number>>;
      fetchPost: () => void;
      handleUserReaction: (
        sourcePost: string,
        newReaction: "like" | "heart" | "yum"
      ) => void;

      handleUserBookmark: (sourcePost: string, newBookmark: boolean) => void;
    }
  | undefined
>(undefined);

export const DiscoveryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [page, setPage] = useState<number>(1); //Page that FE will be requesting
  const [postList, setPostList] = useState<postStructure[]>([]); //A list of fetched post
  const [loadState, setLoadState] = useState<"loading" | "loaded">(() => {
    return postList.length === 0 ? "loading" : "loaded";
  });
  const [scrollY, setScrollY] = useState<number>(0); //Keep track of user scroll position
  const [isFetching, setIsFetching] = useState<boolean>(false); //Prevent multiple fetch

  const { requestNewAccessToken } = useAuthContext();

  //List of user pending reactions needed to be handled
  const pendingReactions = useRef<Map<string, "like" | "heart" | "yum">>(
    new Map()
  );

  const pendingBookmark = useRef<Map<string, boolean>>(new Map());

  const authError = useCallback((status: number) => {
    const error: any = new Error("Failed to fetch");
    error.status = status;
    return error;
  }, []);

  /**
   * Fetch 10 new posts with incremental page
   * @returns
   */
  const fetchPost = async () => {
    try {
      if (isFetching) return;
      setIsFetching(true);

      const res = await fetch(`http://localhost:4000/discover?page=${page}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("ded");

      const data = await res.json();

      const newPosts: postStructure[] = data.posts;
      setPostList((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);

      setLoadState("loaded");
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  };

  /**
   * Handle when a user reacts to a post by confirming with backend
   *
   * @param newReactions - the user reaction
   * @param sourcePost - the post that the user reacted
   */
  const handleUserReaction = useCallback(
    async (sourcePost: string, newReaction: "like" | "heart" | "yum") => {
      //If the reaction is already in queue, exit
      if (pendingReactions.current.has(sourcePost)) return;

      pendingReactions.current.set(sourcePost, newReaction);

      //Save the state of the post before reaction
      let previousPostState: postStructure | null = null;

      setPostList((prev) =>
        prev.map((item) => {
          if (item.postID !== sourcePost) return item;
          previousPostState = item;

          const oldReaction = item.userReaction;
          const reactions = { ...item.reactions };

          //Case 1: Click again
          if (oldReaction === newReaction) {
            reactions[newReaction] -= 1;
            return { ...item, reactions, userReaction: "" };
          }

          if (oldReaction) reactions[oldReaction] -= 1;
          reactions[newReaction] += 1;

          return { ...item, reactions, userReaction: newReaction };
        })
      );

      try {
        //Timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`http://192.168.1.9/reaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reaction: newReaction, postID: sourcePost }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) throw authError(res.status);
      } catch (err: any) {
        if (err.status === 401) {
          if (await requestNewAccessToken()) {
            //Timeout
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(`http://192.168.1.9/reaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reaction: newReaction,
                postID: sourcePost,
              }),
              signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!res.ok) throw authError(res.status);
          }
        }

        if (previousPostState) {
          setPostList((prev) =>
            prev.map((item) =>
              item.postID === sourcePost ? previousPostState! : item
            )
          );

          alert("Sign in to react to the post");
        }
      } finally {
        // Always clear pending reactions
        pendingReactions.current.delete(sourcePost);
      }
    },
    []
  );

  const handleUserBookmark = useCallback(
    async (sourcePost: string, newBookmark: boolean) => {
      if (pendingBookmark.current.has(sourcePost)) return;

      pendingBookmark.current.set(sourcePost, newBookmark);

      let previousPostState: postStructure | null = null;

      setPostList((prev) =>
        prev.map((item) => {
          if (item.postID !== sourcePost) return item;
          previousPostState = item;

          return { ...item, userBookmark: newBookmark };
        })
      );

      try {
        //Timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`http://192.168.1.9/bookmark`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookmark: newBookmark, postID: sourcePost }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) throw authError(res.status);
      } catch (err: any) {
        if (err.status === 401) {
          if (await requestNewAccessToken()) {
            //Timeout
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(`http://192.168.1.9/bookmark`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookmark: newBookmark,
                postID: sourcePost,
              }),
              signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!res.ok) throw authError(res.status);
          }
        }

        if (previousPostState) {
          setPostList((prev) =>
            prev.map((item) =>
              item.postID === sourcePost ? previousPostState! : item
            )
          );

          alert("Sign in to save post to bookmark");
        }
      } finally {
        // Always clear pending reactions
        pendingBookmark.current.delete(sourcePost);
      }
    },
    []
  );

  return (
    <DiscoveryContext.Provider
      value={{
        page,
        postList,
        loadState,
        scrollY,
        setScrollY,
        fetchPost,
        handleUserReaction,
        handleUserBookmark,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscoveryContext = () => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error("Error");
  }

  return context;
};
