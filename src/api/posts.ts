import type { QueryFunction } from "@tanstack/react-query";
import type {
  ActionPayload,
  FullPostStructure,
  PostStructure,
  ReactionType,
} from "../types/PostType";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

/**
 * fetcher functions for tanstack useInfiniteQuery()
 * @param pageParam
 * @returns a posts object with a nextPage cursor`
 */
export const fetchPosts = async (pageParam: number) => {
  const { accessToken } = useAuthStore.getState();

  //Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  //Add authorization if token exists
  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  }

  //Fetch posts from backend
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/discover?page=${pageParam}`, {
    headers: headers,
  });

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
export const fetchDetailedPost: QueryFunction<FullPostStructure, [string, string]> = async ({
  queryKey,
}) => {
  const [, postId] = queryKey;
  const { accessToken } = useAuthStore.getState();

  //Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  //Add authorization if token exists
  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
    headers: headers,
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
 * @param { action, postId, newReaction, newBookmark } ActionPayload type of action , new reaction or bookmark state and postId
 */
export const uploadUserAction = async (
  accessToken: string,
  controller: AbortController,
  { action, postId, newReaction, newBookmark }: ActionPayload
) => {
  //Construct body with full ActionPayload format
  const body = JSON.stringify({
    action,
    postId,
    newReaction,
    newBookmark,
  });

  //Upload user action to unified endpoint
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user-action/user-action`, {
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

export const computeReactionState = (
  newReaction: string | null,
  currentReaction: string | null
): ReactionType | null => {
  if (newReaction != "like" && newReaction != "heart" && newReaction != "yum") {
    return null; // Invalid reaction type
  }

  if (currentReaction === newReaction) {
    return null; // Remove reaction
  }

  return newReaction; // Set new reaction
};

/**
 * Function for tanstack useMutation()
 * @param { action, postId, newReaction, newBookmark } ActionPayload type of action , new reaction or bookmark state and postId
 */
export const confirmUserAction = async ({
  action,
  postId,
  newReaction,
  newBookmark,
}: ActionPayload) => {
  const accessToken = useAuthStore.getState().accessToken;
  const requestNewAccessToken = useAuthStore.getState().requestNewAccessToken;
  const Toast = useToastStore.getState().Toast;

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
      postId,
      newReaction,
      newBookmark,
    });
  } catch (e) {
    // Refresh token and retry again
    await requestNewAccessToken();
    const updatedToken = useAuthStore.getState().accessToken;

    if (!updatedToken) {
      Toast({
        type: "error",
        title: "Authentication Error",
        message: "Please sign in to react to the post",
      });
      return;
    }
    try {
      await uploadUserAction(updatedToken, controller, {
        action,
        postId,
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
};
