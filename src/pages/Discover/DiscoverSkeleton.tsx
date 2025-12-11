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
      />
    );
  });
};

export default DiscoverSkeleton;
