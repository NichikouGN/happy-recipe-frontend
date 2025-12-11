import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import { Fragment, useEffect, useRef } from "react";
import { usePosts } from "../../context/PostContext";

const DiscoverContent = () => {
  const { postList, fetchNextPage, discoverScrollY } = usePosts();
  const fetchTrigger = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  //Intersection Observer to trigger additional fetch
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          observer.disconnect();
          fetchNextPage();
        }
      },
      { threshold: 0.5 } //half of the reference is needed to trigger observer
    );

    if (fetchTrigger.current) observer.observe(fetchTrigger.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, [postList]);

  return postList.map(
    (
      {
        postId,
        title,
        authorName,
        cookTime,
        servings,
        difficulty,
        coverImgUrl,
        reactions,
        userActions,
      },
      index
    ) => {
      return (
        <Fragment key={postId}>
          <Card
            key={postId}
            postId={postId}
            onClick={() => {
              discoverScrollY.current = window.scrollY;
              navigate(`/post/${postId}`);
            }}
            cardType="post"
            cardLoaded={true}
            postImg={coverImgUrl}
            title={title}
            author={authorName}
            time={cookTime}
            difficulty={difficulty}
            serving={servings}
            reactions={reactions}
            userActions={userActions}
          />

          {/*Set the fetch trigger to the 3rd element from the bottom up */}
          {index === postList.length - 4 ? (
            <div ref={fetchTrigger} style={{ height: "0" }} />
          ) : undefined}
        </Fragment>
      );
    }
  );
};

export default DiscoverContent;
