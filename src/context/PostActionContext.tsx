import { createContext, useContext, useCallback, useRef, type FC, type ReactNode } from "react";

// TanStack
import { queryClient } from "../queryClient";

// Stores & API
import { confirmUserAction } from "../api/discover";

// Hooks
import { useReactionMutation } from "../hooks/useReactionMutation";
import { useBookMarkMutation } from "../hooks/useBookMarkMutation";

// Types
import type { ReactionType } from "../types/PostType";

type PostActionsContextType = {
  handleUserReaction: (postId: string, reaction: ReactionType) => void;
  handleUserBookmark: (postId: string, bookmarked: boolean) => void;
};

const PostActionsContext = createContext<PostActionsContextType | undefined>(undefined);

export const PostActionsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pendingMutation = useRef<Set<string>>(new Set());

  // Reaction mutation
  const reactionMutation = useReactionMutation({
    queryClient,
    confirmUserAction,
    pendingMutation,
  });

  // Bookmark mutation
  const bookmarkMutation = useBookMarkMutation({
    queryClient,
    confirmUserAction,
    pendingMutation,
  });

  const handleUserReaction = useCallback(
    (postId: string, reaction: ReactionType) => {
      if (pendingMutation.current.has(postId)) return;

      pendingMutation.current.add(postId);

      reactionMutation.mutate({
        action: "reaction",
        postId,
        newReaction: reaction,
      });
    },
    [reactionMutation]
  );

  const handleUserBookmark = useCallback(
    (postId: string, bookmarked: boolean) => {
      if (pendingMutation.current.has(postId)) return;

      pendingMutation.current.add(postId);

      bookmarkMutation.mutate({
        action: "bookmark",
        postId,
        newBookmark: bookmarked,
      });
    },
    [bookmarkMutation]
  );

  return (
    <PostActionsContext.Provider value={{ handleUserReaction, handleUserBookmark }}>
      {children}
    </PostActionsContext.Provider>
  );
};

export const usePostActions = () => {
  const ctx = useContext(PostActionsContext);
  if (!ctx) {
    throw new Error("usePostActions must be used within PostActionsProvider");
  }
  return ctx;
};
