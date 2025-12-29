export default function MovieCard({ movie, onSelect }) {
  return (
    <a
      role="button"
      className="movie block cursor-pointer"
      onClick={() => onSelect(movie)}
    >
      <img
        className="mb-5 rounded-[15px] w-full"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt="Poster"
      />
      <p className="font-['Roboto'] font-semibold text-[18px] leading-none text-white mb-[13px]">
        {movie.title}
      </p>
      <div className="flex items-center gap-[7px] font-['Roboto'] font-medium text-[18px] leading-none text-white">
        {Math.floor(movie.vote_average * 10) / 10}
        <img className="h-5 w-5" src="/src/assets/star.png" alt="Star" />
      </div>
    </a>
  );
}
