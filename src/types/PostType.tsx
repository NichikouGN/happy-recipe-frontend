import { AiFillLike } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";

export interface Reaction {
  like: number;
  heart: number;
  yum: number;
}

export type ReactionType = "like" | "heart" | "yum" | null;

export interface UserActions {
  userReaction: ReactionType | null;
  userBookmark: boolean;
}

export interface PostStructure {
  postId: string;
  title: string;
  coverImgUrl: string;
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
  steps: {
    stepNum: number;
    stepDesc: string;
    stepImgUrl?: string | undefined;
  }[];
}

export interface ActionPayload {
  action: "reaction" | "bookmark";
  postId: string;
  newReaction?: ReactionType;
  newBookmark?: boolean;
}

export const reactionType = [
  { reactionType: "like", icon: AiFillLike, color: "var(--sky-500)" },
  { reactionType: "heart", icon: FaHeart, color: "var(--red-500)" },
  { reactionType: "yum", icon: GiForkKnifeSpoon, color: "var(--yellow-600)" },
] as const;

export interface CommentBase {
  commentId: string;
  postId: string;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  parentCommentID: string | null;
  replyCount?: number;
}

export interface CommentStructure extends CommentBase {
  nextRepliesPage?: number;
  replies?: CommentStructure[];
}

export interface FullPostWithCommentsStructure extends FullPostStructure {
  comments?: CommentStructure[];
}
