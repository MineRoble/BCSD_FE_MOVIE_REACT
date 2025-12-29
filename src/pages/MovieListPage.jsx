import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getMovieDetails, getPopularMovies, searchMovies } from '../api/tmdb';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import MovieModal from '../components/MovieModal';
import { useUserMovies } from '../contexts/UserMoviesContext';

function MovieListPage() {
  const navigate = useNavigate();
  const { query } = useParams();
  const decodedQuery = query ? decodeURIComponent(query) : "";
  const pageRef = useRef(1);
  const searchRef = useRef();

  const [isModalVisible, setModalVisible] = useState(false);
  const [movies, setMovies] = useState([]);
  const [modalMovie, setModalMovie] = useState({});
  const [heading, setHeading] = useState("지금 인기있는 영화");
  const [myVote, setMyVote] = useState(0);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { getVote, saveVote } = useUserMovies();

  const fetchPopular = async (append) => {
    try {
      const data = await getPopularMovies(pageRef.current);
      pageRef.current += 1;
      setMovies((prev) => (append ? [...prev, ...data.results] : data.results));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSearch = async (searchQuery, append) => {
    if (!searchQuery) {
      return;
    }

    try {
      const data = await searchMovies(searchQuery, pageRef.current);
      pageRef.current += 1;
      setMovies((prev) => (append ? [...prev, ...data.results] : data.results));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    pageRef.current = 1;
    if (decodedQuery) {
      setHeading(`"${decodedQuery}" 검색결과`);
      setMovies([]);
      fetchSearch(decodedQuery, false);
      if (searchRef.current) {
        searchRef.current.value = decodedQuery;
      }
    } else {
      setHeading("지금 인기있는 영화");
      setMovies([]);
      fetchPopular(false);
      if (searchRef.current) {
        searchRef.current.value = "";
      }
    }
  }, [decodedQuery]);

  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalVisible]);

  const handleSearchSubmit = () => {
    const rawQuery = searchRef.current?.value?.trim() ?? "";
    if (!rawQuery) {
      return;
    }

    if (rawQuery === decodedQuery) {
      pageRef.current = 1;
      setHeading(`"${rawQuery}" 검색결과`);
      setMovies([]);
      fetchSearch(rawQuery, false);
      return;
    }

    navigate(`/search/${encodeURIComponent(rawQuery)}`);
  };

  const handleSearchButtonClick = (event) => {
    if (window.innerWidth <= 480 && !isMobileSearchOpen) {
      setMobileSearchOpen(true);
      event.preventDefault();
    }
  };

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoteMouseLeave = () => {
    if (!modalMovie?.id) {
      return;
    }

    setMyVote(getVote(modalMovie.id));
  };

  const handleVoteSave = () => {
    if (!modalMovie?.id) {
      return;
    }

    saveVote(modalMovie.id, myVote);
  };

  const handleLoadMore = () => {
    if (decodedQuery) {
      fetchSearch(decodedQuery, true);
    } else {
      fetchPopular(true);
    }
  };

  return (
    <>
      <Header
        isMobileSearchOpen={isMobileSearchOpen}
        searchRef={searchRef}
        onSearchSubmit={handleSearchSubmit}
        onSearchButtonClick={handleSearchButtonClick}
        onSearchFocus={() => setMobileSearchOpen(true)}
      />

      <main className="py-[75px] px-[180px] max-[1280px]:py-16 max-[1280px]:px-[120px] max-[900px]:py-12 max-[900px]:px-16 max-[480px]:py-8 max-[480px]:px-4">
        <h4 className="font-['Roboto'] font-semibold text-[34px] leading-[36px] text-white/87 mb-12">
          {heading}
        </h4>

        <MovieGrid movies={movies} onSelect={handleMovieSelect} />

        <button
          id="btnMore"
          className="w-full h-[60px] rounded-lg bg-[#F33F3F] text-white font-['Roboto'] font-semibold text-[18px] leading-7"
          onClick={handleLoadMore}
        >
          더보기
        </button>
      </main>

      <MovieModal
        isVisible={isModalVisible}
        movie={modalMovie}
        myVote={myVote}
        onVoteChange={setMyVote}
        onVoteMouseLeave={handleVoteMouseLeave}
        onVoteSave={handleVoteSave}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default MovieListPage;
