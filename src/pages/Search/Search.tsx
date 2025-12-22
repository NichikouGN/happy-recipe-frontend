import styles from "./Search.module.css";
import { Link, useNavigate } from "react-router-dom";
import { TbMessageChatbot, TbMessageChatbotFilled } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";

// Example tags for search suggestions
const tags = [
  { tag: "Pasta", color: "yellow" },
  { tag: "Vegan", color: "green" },
  { tag: "Chicken", color: "red" },
  { tag: "Salad", color: "green" },
  { tag: "Dessert", color: "blue" },
  { tag: "Soup", color: "blue" },
];

const Search = () => {
  const navigate = useNavigate();

  // State to manage transition animation
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [engagedAI, setEngagedAI] = useState<boolean>(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSearchQuery("");
      setEngagedAI(false);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.trim() === "") return;

    if (engagedAI) {
      navigate(`/search/ai/results?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/search/results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className={styles["header"]}>
        <Link to="/discover" className={styles["header-item"]}>
          Discover
        </Link>
        <button className={`${styles["header-item"]} ${styles["current"]}`}>Search</button>
      </header>

      <main className={styles["content"]}>
        <div className={styles["search-container"]}>
          <h1 className={styles["search-title"]}>What do you fancy today?</h1>
          <div className={styles["search-suggestion-container"]}>
            {tags.map(({ tag, color }) => (
              <button
                key={tag}
                className={`${styles["search-suggestion-item"]} ${styles[color]}`}
                onClick={() => {
                  handleInputChange({
                    target: { value: tag },
                  } as React.ChangeEvent<HTMLInputElement>);
                  navigate(`/search/results?query=${encodeURIComponent(tag)}`);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className={`${styles["search-input-container"]}`}>
            <button className={styles["search-input-btn"]} onClick={() => setEngagedAI(!engagedAI)}>
              {engagedAI ? (
                <TbMessageChatbotFilled className={styles["search-input-btn-icon"]} />
              ) : (
                <TbMessageChatbot className={styles["search-input-btn-icon"]} />
              )}
            </button>
            <form className={styles["search-form"]} onSubmit={handleFormSubmit}>
              <input
                type="text"
                className={styles["search-input"]}
                value={searchQuery}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
              <button type="submit" className={styles["search-input-btn"]}>
                <IoSearch className={styles["search-input-btn-icon"]} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Search;
