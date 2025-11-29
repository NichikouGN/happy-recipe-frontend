import { useParams } from "react-router-dom";
import { usePosts } from "../../context/PostContext";

import PostSkeleton from "./PostSkeleton";
import PostContent from "./PostContent";

const Post = () => {
  const { useDetailedPost } = usePosts();
  const { postID } = useParams();

  if (!postID) {
    return <>No Args</>;
  }

  const { data: detailedPost, isFetching } = useDetailedPost(postID);

  return (
    <>
      {isFetching && !detailedPost && <PostSkeleton />}
      {detailedPost && <PostContent detailedPost={detailedPost} />}
    </>
  );
};

export default Post;
