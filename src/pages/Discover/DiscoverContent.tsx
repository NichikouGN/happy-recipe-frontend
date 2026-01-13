import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import { Fragment, useEffect, useRef } from "react";
import { useUserStore } from "../../stores/userStore";
import { useDiscover } from "../../context/DiscoverContext";

const DiscoverContent = () => {
  const userInformation = useUserStore((state) => state.userInformation);
  const { postList, fetchNextPage, isFetchingNextPage, discoverScrollY } = useDiscover();
  const fetchTrigger = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && !isFetchingNextPage) {
          observer.disconnect();
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (fetchTrigger.current) observer.observe(fetchTrigger.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, [postList, isFetchingNextPage, fetchNextPage]);

  return postList.map(
    (
      {
        postId,
        title,
        authorName,
        authorId,
        authorImgUrl,
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
            authorName={authorName}
            authorId={authorId}
            authorImgUrl={authorImgUrl}
            currentUserId={userInformation.userId}
            time={cookTime}
            difficulty={difficulty}
            serving={servings}
            reactions={reactions}
            userActions={userActions}
          />

          {/*Set the fetch trigger to the 2nd element from the bottom up */}
          {index === postList.length - 2 && postList.length >= 10 ? (
            <div ref={fetchTrigger} style={{ height: "0" }} />
          ) : undefined}
        </Fragment>
      );
    }
  );
};

export default DiscoverContent;
