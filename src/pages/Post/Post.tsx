import { useParams } from "react-router-dom";

import PostSkeleton from "./PostSkeleton";
import PostContent from "./PostContent";
import PostError from "./PostError";

import { useDetailedPost } from "../../context/useDetailedPost";

const Post = () => {
  const { postId } = useParams();

  if (!postId) {
    return <>No Args</>;
  }

  const { data: detailedPost, isLoading } = useDetailedPost(postId);

  return (
    <>
      {isLoading && <PostSkeleton />}
      {!detailedPost && <PostError />}
      {detailedPost && <PostContent detailedPost={detailedPost} />}
    </>
  );
};

export default Post;
