import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { PostStructure } from "../types/PostType";
import { fetchSearchSuggestions } from "../api/search";

const SearchContext = createContext<
  | {
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
  | undefined
>(undefined);

export const SearchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [engagedAI, setEngagedAI] = useState<boolean>(false);
  const [engagedSearch, setEngagedSearch] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [searchResults, setSearchResults] = useState<PostStructure[]>([]);
  const [numberOfResults, setNumberOfResults] = useState<number>(0);

  /**
   * Handles the search functionality and updates the search results.
   * @param query what the user is searching for
   * @returns a list of search results
   */
  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setNumberOfResults(0);
      setEngagedSearch(false);
      return;
    }

    setSearchQuery(query);
    setEngagedSearch(true);

    fetchSearchSuggestions(query).then((data) => {
      setSearchResults(data.searchResults);
      setNumberOfResults(data.searchResults.length);
    });
  };

  return (
    <SearchContext.Provider
      value={{
        engagedAI,
        engagedSearch,
        setEngagedAI,
        setEngagedSearch,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        numberOfResults,
        setNumberOfResults,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
