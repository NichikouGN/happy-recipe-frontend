import { createContext, useContext, useRef, type FC, type ReactNode } from "react";

// TanStack
import { useInfiniteQuery } from "@tanstack/react-query";

// API
import { fetchPosts } from "../api/discover";

// Types
import type { PostStructure } from "../types/PostType";

type DiscoverContextType = {
  postList: PostStructure[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  discoverScrollY: React.RefObject<number>;
};

const DiscoverContext = createContext<DiscoverContextType | undefined>(undefined);

export const DiscoverProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const discoverScrollY = useRef<number>(0);

  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["discoverPosts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });

  const postList: PostStructure[] = data ? data.pages.flatMap((page) => page.posts) : [];

  return (
    <DiscoverContext.Provider
      value={{
        postList,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        discoverScrollY,
      }}
    >
      {children}
    </DiscoverContext.Provider>
  );
};

export const useDiscover = () => {
  const ctx = useContext(DiscoverContext);
  if (!ctx) {
    throw new Error("useDiscover must be used within DiscoverProvider");
  }
  return ctx;
};
