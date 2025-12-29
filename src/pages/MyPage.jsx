import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { getMovieDetails } from "../api/tmdb";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { useUserMovies } from "../contexts/UserMoviesContext";

function MyPage() {
  const navigate = useNavigate();
  const searchRef = useRef();
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const authId = localStorage.getItem("movielistAuth");

  const [activeTab, setActiveTab] = useState("rated");
  const [ratedMovies, setRatedMovies] = useState([]);
  const [ratedLoading, setRatedLoading] = useState(false);
  const [ratedError, setRatedError] = useState("");
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMovie, setModalMovie] = useState({});
  const [myVote, setMyVote] = useState(0);
  const { ratedEntries, watchlistIds, getVote, saveVote } = useUserMovies();

  const profile = useMemo(() => {
    const savedUser = localStorage.getItem("movielistUser");
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const entries = ratedEntries;

    if (entries.length === 0) {
      setRatedMovies([]);
      setRatedLoading(false);
      setRatedError("");
      return () => {
        isMounted = false;
      };
    }

    setRatedLoading(true);
    setRatedError("");

    Promise.all(
      entries.map(async (entry) => {
        const data = await getMovieDetails(entry.id);
        return {
          id: data.id,
          title: data.title,
          poster_path: data.poster_path,
          vote_average: data.vote_average,
          myVote: entry.vote,
        };
      })
    )
      .then((movies) => {
        if (!isMounted) return;
        setRatedMovies(movies.filter((movie) => movie?.id));
        setRatedLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setRatedError("평가한 영화를 불러오지 못했습니다.");
        setRatedLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ratedEntries]);

  useEffect(() => {
    let isMounted = true;
    const entries = watchlistIds;

    if (entries.length === 0) {
      setWatchlistMovies([]);
      setWatchlistLoading(false);
      setWatchlistError("");
      return () => {
        isMounted = false;
      };
    }

    setWatchlistLoading(true);
    setWatchlistError("");

    Promise.all(
      entries.map(async (id) => {
        const data = await getMovieDetails(id);
        return {
          id: data.id,
          title: data.title,
          poster_path: data.poster_path,
          vote_average: data.vote_average,
        };
      })
    )
      .then((movies) => {
        if (!isMounted) return;
        setWatchlistMovies(movies.filter((movie) => movie?.id));
        setWatchlistLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setWatchlistError("보고싶은 영화를 불러오지 못했습니다.");
        setWatchlistLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [watchlistIds]);

  const handleMovieSelect = async (movie) => {
    try {
      const data = await getMovieDetails(movie.id);

      setModalMovie({
        id: movie.id,
        poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        overview: data.overview,
        title: data.title,
        genres: data.genres.map((genre) => genre.name).join(", "),
        vote_average: Math.floor(data.vote_average * 10) / 10,
      });

      setMyVote(getVote(movie.id));
      setModalVisible(true);
    } catch (error) {
      setRatedError("평가한 영화를 불러오지 못했습니다.");
    }
  };

  const handleVoteMouseLeave = () => {
    if (!modalMovie?.id) return;

    setMyVote(getVote(modalMovie.id));
  };

  const handleVoteSave = () => {
    if (!modalMovie?.id) return;

    saveVote(modalMovie.id, myVote);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  if (!authId) {
    return <Navigate to="/login" replace />;
  }

  const handleSearchSubmit = () => {
    const rawQuery = searchRef.current?.value?.trim() ?? "";
    if (!rawQuery) return;
    navigate(`/search/${encodeURIComponent(rawQuery)}`);
  };

  const handleSearchButtonClick = (event) => {
    if (window.innerWidth <= 480 && !isMobileSearchOpen) {
      setMobileSearchOpen(true);
      event.preventDefault();
    }
  };

  const genreText = profile?.genres?.length ? profile.genres.join(", ") : "-";
  const ratedCount = ratedEntries.length;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        isMobileSearchOpen={isMobileSearchOpen}
        searchRef={searchRef}
        onSearchSubmit={handleSearchSubmit}
        onSearchButtonClick={handleSearchButtonClick}
        onSearchFocus={() => setMobileSearchOpen(true)}
      />

      <main className="px-6 pb-24 pt-14">
        <div className="mx-auto w-full max-w-4xl">
          <section className="rounded-2xl border border-white/10 bg-white/10 px-8 py-10 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
            <div className="flex flex-col items-start gap-6">
              <div className="h-28 w-28 shrink-0 rounded-full bg-white/95 text-black/60 shadow-inner flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/user.svg"
                  alt="프로필"
                  className="h-full w-full p-5 object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  {profile?.nickname ?? "닉네임"}
                </h2>

                <p className="mt-4 text-xl font-semibold">
                  평가 영화 수 :{" "}
                  <span className="text-red-500">{ratedCount}</span>
                </p>

                <p className="mt-3 text-xl font-semibold">
                  선호 장르 : <span className="font-semibold">{genreText}</span>
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center gap-8 text-base font-semibold text-white/80">
              <button
                type="button"
                onClick={() => setActiveTab("rated")}
                className={`relative pb-3 transition ${
                  activeTab === "rated" ? "text-white" : "text-white/70"
                }`}
              >
                평가한 영화
                {activeTab === "rated" && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-red-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("watchlist")}
                className={`relative pb-3 transition ${
                  activeTab === "watchlist" ? "text-white" : "text-white/70"
                }`}
              >
                보고싶은 영화
                {activeTab === "watchlist" && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-red-500" />
                )}
              </button>
            </div>

            <div className="h-px w-full bg-white/15" />

            <div className="pt-10">
              {activeTab === "rated" ? (
                <>
                  {ratedLoading ? (
                    <div className="text-white/50">평가한 영화를 불러오는 중...</div>
                  ) : ratedError ? (
                    <div className="text-[#F33F3F]">{ratedError}</div>
                  ) : ratedMovies.length === 0 ? (
                    <div className="text-white/50">평가한 영화가 없습니다.</div>
                  ) : (
                    <div className="grid grid-cols-4 gap-10 max-[1280px]:grid-cols-3 max-[1280px]:gap-8 max-[900px]:grid-cols-2 max-[900px]:gap-6 max-[480px]:grid-cols-1">
                      {ratedMovies.map((movie) => (
                        <div key={movie.id} className="movie">
                          <MovieCard
                            movie={movie}
                            onSelect={handleMovieSelect}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {watchlistLoading ? (
                    <div className="text-white/50">보고싶은 영화를 불러오는 중...</div>
                  ) : watchlistError ? (
                    <div className="text-[#F33F3F]">{watchlistError}</div>
                  ) : watchlistMovies.length === 0 ? (
                    <div className="text-white/50">보고싶은 영화가 없습니다.</div>
                  ) : (
                    <div className="grid grid-cols-4 gap-10 max-[1280px]:grid-cols-3 max-[1280px]:gap-8 max-[900px]:grid-cols-2 max-[900px]:gap-6 max-[480px]:grid-cols-1">
                      {watchlistMovies.map((movie) => (
                        <div key={movie.id} className="movie">
                          <MovieCard movie={movie} onSelect={handleMovieSelect} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <MovieModal
        isVisible={isModalVisible}
        movie={modalMovie}
        myVote={myVote}
        onVoteChange={setMyVote}
        onVoteMouseLeave={handleVoteMouseLeave}
        onVoteSave={handleVoteSave}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default MyPage;
