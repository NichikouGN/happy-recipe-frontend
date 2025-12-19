import { create } from "zustand";
import type { PostStructure } from "../types/PostType";
import { fetchSearchSuggestions } from "../api/search";
import { formatConsoleError } from "../consoleError";

interface searchStoreState {
  searchResults: PostStructure[];
  setSearchResults: (results: PostStructure[]) => void;

  numberOfResults: number;
  setNumberOfResults: (count: number) => void;

  handleSearch: (query: string, engaedAI: boolean) => void;
}

export const useSearchStore = create<searchStoreState>((set, get) => ({
  searchResults: [],
  setSearchResults: (results: PostStructure[]) => set({ searchResults: results }),

  numberOfResults: 0,
  setNumberOfResults: (count: number) => set({ numberOfResults: count }),

  handleSearch: (query: string, engagedAI: boolean) => {
    if (query.trim() === "") {
      get().setSearchResults([]);
      get().setNumberOfResults(0);
      return;
    }

    fetchSearchSuggestions(query)
      .then((data) => {
        get().setSearchResults(data.searchResults);
        get().setNumberOfResults(data.searchResults.length);
      })
      .catch((error) => {
        formatConsoleError("searchStore.ts", "handleSearch", error);
        get().setSearchResults([]);
        get().setNumberOfResults(0);
      });
  },
}));
