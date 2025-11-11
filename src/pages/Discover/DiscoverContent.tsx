import { useNavigate } from "react-router-dom";
import { useDiscoveryContext } from "../../context/DiscoveryContext";
import Card from "../../components/Card/Card";
import { useEffect, useRef } from "react";

const DiscoverContent = () => {
  const { postList, fetchPost } = useDiscoveryContext();
  const fetchTrigger = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  //Intersection Observer to trigger additional fetch
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          console.log("fetch");
          observer.disconnect();
          fetchPost();
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
        postID,
        title,
        authorName,
        cookTime,
        servings,
        difficulty,
        coverImageURL,
        reactions,
        userReaction,
        userBookmark,
      },
      index
    ) => {
      return (
        <>
          <Card
            key={postID}
            postID={postID}
            onClick={() => {
              navigate(`/post/${postID}`);
            }}
            cardType="post"
            cardLoaded={true}
            postImg={coverImageURL}
            title={title}
            author={authorName}
            time={cookTime}
            difficulty={difficulty}
            serving={servings}
            reactions={reactions}
            userReaction={userReaction}
            isBookmarked={userBookmark}
          />
          {index === postList.length - 4 ? (
            <div ref={fetchTrigger} style={{ lineHeight: "0" }}></div>
          ) : undefined}
          {/*Set the fetch trigger to the 3rd element from the bottom up */}
        </>
      );
    }
  );
};

export default DiscoverContent;
