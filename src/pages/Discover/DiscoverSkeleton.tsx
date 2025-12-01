import Card from "../../components/Card/Card";

const DiscoverSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => {
    return (
      <Card
        postId=""
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
        reactions={{ like: 0, heart: 0, yum: 0 }}
        userActions={{ userBookmark: false, userReaction: null }}
      />
    );
  });
};

export default DiscoverSkeleton;
