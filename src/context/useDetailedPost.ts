import { useQuery } from "@tanstack/react-query";
import { fetchDetailedPost } from "../api/post";

export const useDetailedPost = (postId: string) => {
  return useQuery({
    queryKey: ["detailedPost", postId],
    queryFn: fetchDetailedPost,
    enabled: !!postId,
    retry: (failureCount) => {
      return failureCount < 2;
    },
  });
};
