export interface Reaction {
  like: number;
  heart: number;
  yum: number;
}

export type ReactionType = "like" | "heart" | "yum";

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
  steps: {
    stepNum: number;
    stepDesc: string;
  }[];
}

export interface ActionPayload {
  action: "reaction" | "bookmark";
  postID: string;
  newReaction?: ReactionType;
  newBookmark?: boolean;
}

export interface CommentBase {
  commentID: string;
  postID: string;
  userID: number;
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
