import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const UserMoviesContext = createContext(null);

export function UserMoviesProvider({ children }) {
  const [ratedEntries, setRatedEntries] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);

  const loadFromStorage = useCallback(() => {
    const rated = Object.keys(localStorage)
      .filter((key) => key.startsWith("myvote_"))
      .map((key) => {
        const id = Number(key.replace("myvote_", ""));
        const vote = Number(localStorage.getItem(key));
        return { id, vote };
      })
      .filter((entry) => Number.isFinite(entry.id) && entry.vote > 0);

    const watchlist = Object.keys(localStorage)
      .filter((key) => key.startsWith("watchlist_"))
      .map((key) => Number(key.replace("watchlist_", "")))
      .filter((id) => Number.isFinite(id));

    setRatedEntries(rated);
    setWatchlistIds(watchlist);
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const saveVote = useCallback((id, vote) => {
    if (!Number.isFinite(id)) {
      return;
    }

    if (vote > 0) {
      localStorage.setItem(`myvote_${id}`, String(vote));
    } else {
      localStorage.removeItem(`myvote_${id}`);
    }

    setRatedEntries((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      if (vote > 0) {
        next.push({ id, vote });
      }
      return next;
    });
  }, []);

  const toggleWatchlist = useCallback((id) => {
    if (!Number.isFinite(id)) {
      return;
    }

    setWatchlistIds((prev) => {
      if (prev.includes(id)) {
        localStorage.removeItem(`watchlist_${id}`);
        return prev.filter((movieId) => movieId !== id);
      }
      localStorage.setItem(`watchlist_${id}`, "1");
      return [...prev, id];
    });
  }, []);

  const getVote = useCallback(
    (id) => ratedEntries.find((entry) => entry.id === id)?.vote ?? 0,
    [ratedEntries]
  );

  const isWatchlisted = useCallback(
    (id) => watchlistIds.includes(id),
    [watchlistIds]
  );

  const value = useMemo(
    () => ({
      ratedEntries,
      watchlistIds,
      saveVote,
      toggleWatchlist,
      getVote,
      isWatchlisted,
      refreshFromStorage: loadFromStorage,
    }),
    [
      ratedEntries,
      watchlistIds,
      saveVote,
      toggleWatchlist,
      getVote,
      isWatchlisted,
      loadFromStorage,
    ]
  );

  return (
    <UserMoviesContext.Provider value={value}>
      {children}
    </UserMoviesContext.Provider>
  );
}

export function useUserMovies() {
  const context = useContext(UserMoviesContext);
  if (!context) {
    throw new Error("useUserMovies must be used within a UserMoviesProvider");
  }
  return context;
}
