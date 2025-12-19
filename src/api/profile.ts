import { Toast } from "../stores/toastStore";
import type { PostStructure } from "../types/PostType";

export const fetchBookmarkedPosts = async (
  userId: string,
  bookmarkedPage: number,
  setBookmarkedPosts: React.Dispatch<React.SetStateAction<PostStructure[]>>
) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile/${userId}/bookmarks?page=${bookmarkedPage}`
    );
    const data = await res.json();
    setBookmarkedPosts(data.bookmarkedPosts);
  } catch (error) {
    Toast({ type: "error", title: "Error", message: "Unable to Fetch" });
  }
};

export const fetchUserPosts = async (
  userId: string,
  userPostsPage: number,
  setUserPosts: React.Dispatch<React.SetStateAction<PostStructure[]>>
) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile/${userId}/posts?page=${userPostsPage}`
    );
    const data = await res.json();
    setUserPosts(data.userPosts);
  } catch (error) {
    Toast({ type: "error", title: "Error", message: "Unable to Fetch" });
  }
};
