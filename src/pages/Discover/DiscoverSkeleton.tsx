import Card from "../../components/Card/Card";

//Return a skeleton that is 4 empty card
const DiscoverSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => {
    return (
      <Card
        postID=""
        key={i.toString()}
        onClick={() => {}}
        cardType="post"
        cardLoaded={false}
        postImg=""
        title=""
        author=""
        time={0}
        difficulty="medium"
        serving={0}
        reactions={{ like: 0, heart: 0, dislike: 0 }}
        isBookmarked={false}
      />
    );
  });
};

export default DiscoverSkeleton;
