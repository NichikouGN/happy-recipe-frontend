import { useParams } from "react-router-dom";
import { usePosts } from "../../context/PostContext";

import PostSkeleton from "./PostSkeleton";
import PostContent from "./PostContent";
import PostError from "./PostError";

const Post = () => {
  const { useDetailedPost } = usePosts();
  const { postId } = useParams();

  if (!postId) {
    return <>No Args</>;
  }

  const { data: detailedPost, isFetching } = useDetailedPost(postId);

  return (
    <>
      {isFetching && <PostSkeleton />}
      {!isFetching && detailedPost && <PostContent detailedPost={detailedPost} />}
      {!isFetching && !detailedPost && <PostError />}
    </>
  );
};

export default Post;
