import styles from "./Search.module.css";
import { FaPlus } from "react-icons/fa6";

const Search = () => {
  return (
    <>
      <div className={styles["header"]}>
        <img
          className={styles["header-image"]}
          src="/src/assets/search-menu.jpg"
        />
        <div className={styles["search-bar-container"]}>
          <p>What do you feel like ?</p>
          <div className={styles["search-bar-wrapper"]}>
            <form className={styles["search-bar-input"]}>
              <input
                className={styles["search-bar-input"]}
                type="text"
                placeholder="Search something "
              />
            </form>

            <div className={styles["search-bar-filter-wrapper"]}>
              <FaPlus className={styles["search-bar-filter"]} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles["content"]}></div>
      <div className={styles["footer"]}>GHJ</div>
    </>
  );
};

export default Search;
