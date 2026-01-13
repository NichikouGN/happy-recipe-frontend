import { Toast } from "../stores/toastStore";
import type { PostStructure } from "../types/PostType";

/**
 * Fetch bookmarked posts for a user
 * @param userId The ID of the user
 * @param bookmarkedPage The page number to fetch
 * @param setBookmarkedPosts Function to update the bookmarked posts state
 */
export const fetchBookmarkedPosts = async (
  userId: string,
  bookmarkedPage: number,
  setBookmarkedPosts: React.Dispatch<React.SetStateAction<PostStructure[]>>,
  isFetchingBookmarks: React.MutableRefObject<boolean>
) => {
  if (isFetchingBookmarks.current) return;

  isFetchingBookmarks.current = true;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile/${userId}/bookmarks?page=${bookmarkedPage}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Unable to fetch bookmarked posts");
    }

    const data: { bookmarkedPosts: PostStructure[] } = await res.json();
    setBookmarkedPosts((prev) => [...prev, ...data.bookmarkedPosts]);
  } catch (error) {
    Toast({ type: "error", title: "Error", message: "Unable to Fetch" });
  } finally {
    isFetchingBookmarks.current = false;
  }
};

/**
 * Fetch user uploaded posts
 * @param userId The ID of the user
 * @param userPostsPage The page number to fetch
 * @param setUserPosts Function to update the user posts state
 */
export const fetchUserPosts = async (
  userId: string,
  userPostsPage: number,
  setUserPosts: React.Dispatch<React.SetStateAction<PostStructure[]>>,
  isFetchingPosts: React.MutableRefObject<boolean>
) => {
  if (isFetchingPosts.current) return;

  isFetchingPosts.current = true;
  try {
    console.log("Fetching user posts for page:", userPostsPage);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile/${userId}/posts?page=${userPostsPage}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Unable to fetch user posts");
    }

    const data: { userPosts: PostStructure[] } = await res.json();
    setUserPosts((prev) => [...prev, ...data.userPosts]);
  } catch (error) {
    Toast({ type: "error", title: "Error", message: "Unable to Fetch" });
  } finally {
    isFetchingPosts.current = false;
  }
};
