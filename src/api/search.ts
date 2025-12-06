/**
 * Fetches search results based on the provided query.
 * @param query what the user is searching for
 * @returns a list of search results
 */

export const fetchSearchSuggestions = async (query: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/search?query=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch search suggestions");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
};
