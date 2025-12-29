import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onSelect }) {
  return (
    <div
      id="movies"
      className="grid grid-cols-4 gap-16 mb-16 max-[1280px]:grid-cols-3 max-[1280px]:gap-12 max-[900px]:grid-cols-2 max-[900px]:gap-8 max-[480px]:grid-cols-1 max-[480px]:gap-6"
    >
      {movies.map((movie) => {
        return <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />;
      })}
    </div>
  );
}
