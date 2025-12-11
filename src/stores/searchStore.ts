import { create } from "zustand";
import type { PostStructure } from "../types/PostType";
import { fetchSearchSuggestions } from "../api/search";
import { formatConsoleError } from "../consoleError";

interface searchStoreState {
  engagedAI: boolean;
  setEngagedAI: (engaged: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  searchResults: PostStructure[];
  setSearchResults: (results: PostStructure[]) => void;

  numberOfResults: number;
  setNumberOfResults: (count: number) => void;

  handleSearch: (query: string) => void;
  engagedSearch: boolean;
  setEngagedSearch: (engaged: boolean) => void;
}

export const useSearchStore = create<searchStoreState>((set, get) => ({
  engagedAI: false,
  setEngagedAI: (engaged: boolean) => set({ engagedAI: engaged }),

  engagedSearch: false,
  setEngagedSearch: (engaged: boolean) => set({ engagedSearch: engaged }),

  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  searchResults: [],
  setSearchResults: (results: PostStructure[]) => set({ searchResults: results }),

  numberOfResults: 0,
  setNumberOfResults: (count: number) => set({ numberOfResults: count }),

  handleSearch: (query: string) => {
    if (query.trim() === "") {
      get().setSearchResults([]);
      get().setNumberOfResults(0);
      get().setEngagedSearch(false);
      return;
    }

    get().setSearchQuery(query);
    get().setEngagedSearch(true);

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
