const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const commonHeaders = {
  accept: "application/json",
  Authorization: `Bearer ${TMDB_API_KEY}`,
};

async function requestJson(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: commonHeaders,
  });
  return res.json();
}

export async function getPopularMovies(page) {
  return requestJson(
    `https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KOR&page=${page}`
  );
}

export async function searchMovies(query, page) {
  return requestJson(
    `https://api.themoviedb.org/3/search/movie?include_adult=false&language=ko-KR&page=${page}&region=KOR&query=${encodeURIComponent(
      query
    )}`
  );
}

export async function getMovieDetails(movieId) {
  return requestJson(
    `https://api.themoviedb.org/3/movie/${encodeURIComponent(
      movieId
    )}?language=ko-KR`
  );
}
