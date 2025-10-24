import { useState } from "react";
import styles from "./Header.module.css";
import { FaPlateWheat } from "react-icons/fa6";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Header = () => {
  const [searchText, setSearchText] = useState<string>("");

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchText);
    setSearchText("");
  };

  return (
    <div className={styles["header-container"]}>
      <div className={styles["header-logo"]}>
        <FaPlateWheat></FaPlateWheat>
      </div>
      <form
        className={styles["header-form"]}
        onSubmit={(e) => {
          handleSubmission(e);
        }}
      >
        <div className={styles["header-form__logo"]}>
          <FaMagnifyingGlass />
        </div>
        <input
          className={styles["header-form__input"]}
          type="text"
          placeholder="Search any dishes"
          value={searchText}
          onChange={(e) => {
            handleInputChanges(e);
          }}
        ></input>
      </form>
    </div>
  );
};

export default Header;
