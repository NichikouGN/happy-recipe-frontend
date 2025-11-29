import type { QueryFunction } from "@tanstack/react-query";
import type {
  ActionPayload,
  FullPostStructure,
  PostStructure,
} from "../types/PostType";

/**
 * fetcher functions for tanstack useInfiniteQuery()
 * @param pageParam
 * @returns a posts object with a nextPage cursor`
 */
export const fetchPosts: QueryFunction<
  { posts: PostStructure[]; nextPage: number | undefined },
  [string],
  number
> = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/discover?page=${pageParam}`,
    {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch posts");

  const data = await res.json();
  const newPosts: PostStructure[] = data.postList; //Retrieve the list

  return {
    posts: newPosts,
    nextPage: pageParam + 1,
  };
};

/**
 * Fetch detailed post function for tanstack useQuery()
 *
 * @param queryKey  The query key containing the post ID
 * @returns Detailed post data
 */
export const fetchDetailedPost: QueryFunction<
  FullPostStructure,
  [string, string]
> = async ({ queryKey }) => {
  const [, postID] = queryKey;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/post/${postID}`, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch posts");

  const data = await res.json();
  const detailedPost: FullPostStructure = data.post; //Retrieve the list

  return detailedPost;
};

/**
 * Function to upload user action to the backend server
 *
 * @param accessToken current access token
 * @param controller controller to abort fetch
 * @param { action, postID, newReaction, newBookmark } ActionPayload type of action , new reaction or bookmark state and postID
 */
export const uploadUserAction = async (
  accessToken: string,
  controller: AbortController,
  { action, postID, newReaction, newBookmark }: ActionPayload
) => {
  //Construct body based on action type
  const body =
    action === "reaction"
      ? JSON.stringify({ reaction: newReaction, postID: postID })
      : JSON.stringify({ bookmark: newBookmark, postID: postID });

  //Upload user action
  const res = await fetch(`${import.meta.env.VITE_API_URL}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: body,
    signal: controller.signal,
  });

  if (!res.ok) throw new Error("Action failed");
};
