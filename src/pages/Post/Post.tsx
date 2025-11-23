import { useLocation } from "react-router-dom";
import { usePosts } from "../../context/PostContext";

import PostSkeleton from "./PostSkeleton";
import PostContent from "./PostContent";

const Post = () => {
  const { useDetailedPost } = usePosts();

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const postID = query.get("id");

  if (!postID) {
    return <>No Args</>;
  }

  const { data: detailedPost, isFetching, isFetched } = useDetailedPost(postID);

  if (!detailedPost) {
    return <PostSkeleton />;
  }

  return (
    <>
      {isFetching && <PostSkeleton />}
      {!isFetching && isFetched && <PostContent detailedPost={detailedPost} />}
    </>
  );
};

export default Post;
