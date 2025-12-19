import { create } from "zustand";

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
  chatList: [
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      redirect: "xddhub",
    },
  ],
  userInput: "",
  aiLoading: false,

  setAIWindowOpen: (open: boolean) => set({ aiWindowOpen: open }),

  setChatList: (chatList: ChatContent[]) => set({ chatList }),
  addChatContent: (chatContent: ChatContent) => set({ chatList: [...get().chatList, chatContent] }),
  clearChatList: () => set({ chatList: [] }),

  setUserInput: (input: string) => set({ userInput: input }),
  setAILoading: (loading: boolean) => set({ aiLoading: loading }),

  fetchAIResponse: async () => {
    const { chatList, userInput, aiLoading, addChatContent, setAILoading, setUserInput } = get();

    if (aiLoading) return;
    addChatContent({ role: "user", content: userInput });
    setUserInput("");
    setAILoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatList: [...chatList, { role: "user", content: userInput }] }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      addChatContent({ role: "assistant", content: data.reply });
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      addChatContent({
        role: "assistant",
        content: "Sorry, something went wrong.",
      });
    } finally {
      setAILoading(false);
      clearTimeout(timeoutId);
    }
  },
}));
