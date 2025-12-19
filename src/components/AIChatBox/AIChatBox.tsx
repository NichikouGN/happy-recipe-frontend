import { useAIStore } from "../../stores/AIStore";
import styles from "./AIChatBox.module.css";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { IoSend, IoClose } from "react-icons/io5";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Toast } from "../../stores/toastStore";

const AIChatBox = () => {
  const aiWindowOpen = useAIStore((state) => state.aiWindowOpen);
  const chatList = useAIStore((state) => state.chatList);
  const userInput = useAIStore((state) => state.userInput);
  const setUserInput = useAIStore.getState().setUserInput;
  const aiLoading = useAIStore((state) => state.aiLoading);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmisison = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.trim() === "" || aiLoading) return;

    if (userInput.length > 250) {
      Toast({
        type: "error",
        title: "Message Too Long",
        message: "Your message is too long. Please limit it to 250 characters.",
      });
      return;
    }
    useAIStore.getState().fetchAIResponse();
  };

  return (
    <>
      <button
        className={`${styles["chat-box-toggle"]} ${
          styles[`${aiWindowOpen ? "chat-box-toggle-open" : ""}`]
        }`}
        onClick={() => useAIStore.setState({ aiWindowOpen: !aiWindowOpen })}
      >
        {aiWindowOpen ? (
          <IoClose size={24} className={styles["chat-box-toggle-icon"]} />
        ) : (
          <TbMessageChatbotFilled size={24} className={styles["chat-box-toggle-icon"]} />
        )}
      </button>

      {aiWindowOpen && (
        <div className={`${styles["chat-box-container"]} ${styles["intro"]}`}>
          <header className={styles["header"]}>
            <h1>Happy Recipe</h1>
          </header>
          <main className={styles["content"]}>
            {chatList.map((chat, index) => (
              <div
                key={index}
                className={`${styles["chat-message"]} ${
                  chat.role === "user"
                    ? styles["chat-message-user"]
                    : styles["chat-message-assistant"]
                }`}
              >
                <div className={styles["chat-message-content"]}>{chat.content}</div>
                {chat.redirect && (
                  <Link
                    to={`/search/results?query=${chat.redirect}`}
                    className={styles["chat-message-redirect"]}
                    onClick={() => useAIStore.setState({ aiWindowOpen: false })}
                  >
                    {chat.redirect} <FaExternalLinkAlt size={12} />
                  </Link>
                )}
              </div>
            ))}

            {chatList.filter((chat) => chat.role === "user").length === 0 && (
              <div className={styles["preset-action-bar"]}>
                <button
                  className={styles["preset-action-button"]}
                  onClick={() => {
                    setUserInput("Give me a simple recipe");
                  }}
                  style={{ color: "var(--sky-500)" }}
                >
                  Simple recipe
                </button>
                <button
                  className={styles["preset-action-button"]}
                  onClick={() => {
                    setUserInput("Please recommend me a vegetarian meal");
                  }}
                  style={{ color: "var(--green-500)" }}
                >
                  Vegetarian
                </button>
                <button
                  className={styles["preset-action-button"]}
                  onClick={() => {
                    setUserInput("I have dietary restrictions");
                  }}
                  style={{ color: "var(--red-500)" }}
                >
                  Dietary restrictions
                </button>
              </div>
            )}
            <div ref={scrollRef} />
          </main>
          <footer className={styles["footer"]}>
            <form className={styles["input-form"]} onSubmit={handleSubmisison}>
              <input
                value={userInput}
                type="text"
                className={styles["input-box"]}
                placeholder="Type your message..."
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                type="submit"
                className={`${styles["send-button"]} ${
                  userInput.trim() ? styles["has-input"] : ""
                }`}
              >
                <IoSend className={styles["send-button-icon"]} />
              </button>
            </form>
          </footer>
        </div>
      )}
    </>
  );
};

export default AIChatBox;
