import {
  useState,
  useContext,
  createContext,
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface postStructure {
  postID: string;
  title: string;
  authorID: number;
  authorName: string;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  coverImageURL: string;
}

const DiscoveryContext = createContext<
  | {
      page: number;
      postList: postStructure[];
      loadState: "loading" | "loaded";
      scrollY: number;
      setScrollY: Dispatch<SetStateAction<number>>;
      fetchPost: () => void;
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

  /**
   * Fetch 10 new posts with incremental page
   * @returns
   */
  const fetchPost = async () => {
    try {
      if (isFetching) return;
      const res = await fetch(`http://localhost:4000/discover?page=${page}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("ded");

      const data = await res.json();

      const newPosts: postStructure[] = data.posts;
      setPostList((prev) => [...prev, ...newPosts]);
      setPage(page + 1);

      setLoadState("loaded");
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <DiscoveryContext.Provider
      value={{
        page,
        postList,
        loadState,
        scrollY,
        setScrollY,
        fetchPost,
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
