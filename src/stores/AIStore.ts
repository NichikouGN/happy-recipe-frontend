import { create } from "zustand";
import { formatConsoleError } from "../consoleError";

interface ChatContent {
  role: "user" | "assistant";
  content: string;
  redirect?: string;
}

interface AIStoreType {
  aiWindowOpen: boolean;
  setAIWindowOpen: (open: boolean) => void;

  chatList: ChatContent[];
  setChatList: (chatList: ChatContent[]) => void;

  addChatContent: (chatContent: ChatContent) => void;
  clearChatList: () => void;

  userInput: string;
  setUserInput: (input: string) => void;

  aiLoading: boolean;
  setAILoading: (loading: boolean) => void;

  fetchAIResponse: () => Promise<void>;
}

export const useAIStore = create<AIStoreType>()((set, get) => ({
  aiWindowOpen: false,
  chatList: [],
  userInput: "",
  aiLoading: false,

  setAIWindowOpen: (open: boolean) => set({ aiWindowOpen: open }),

  setChatList: (chatList: ChatContent[]) => set({ chatList }),
  addChatContent: (chatContent: ChatContent) => set({ chatList: [...get().chatList, chatContent] }),
  clearChatList: () => set({ chatList: [] }),

  setUserInput: (input: string) => set({ userInput: input }),
  setAILoading: (loading: boolean) => set({ aiLoading: loading }),

  /*Fetches AI response based on the user input */
  fetchAIResponse: async () => {
    const { chatList, userInput, aiLoading, addChatContent, setAILoading, setUserInput } = get();

    if (aiLoading) return;
    addChatContent({ role: "user", content: userInput });
    setUserInput("");
    setAILoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
    const contextWindow = 10;
    const recentChats = chatList.slice(-contextWindow);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat-gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatList: [...recentChats, { role: "user", content: userInput }] }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI Response Error:", errorText);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      addChatContent({ role: "assistant", content: data.reply, redirect: data.redirect });
    } catch (error) {
      formatConsoleError("AiStore", "fetchAIResponse", error);
      addChatContent({
        role: "assistant",
        content: "Sorry, something went wrong. Please try again later.",
      });
    } finally {
      setAILoading(false);
      clearTimeout(timeoutId);
    }
  },
}));
