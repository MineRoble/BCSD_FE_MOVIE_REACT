import { useUserMovies } from "../contexts/UserMoviesContext";

export default function MovieModal({
  isVisible,
  movie,
  myVote,
  onVoteChange,
  onVoteMouseLeave,
  onVoteSave,
  onClose,
}) {
  const { isWatchlisted, toggleWatchlist } = useUserMovies();

  const handleWishlistToggle = () => {
    if (!movie?.id) {
      return;
    }
    toggleWatchlist(movie.id);
  };

  if (!isVisible || !movie) {
    return null;
  }

  return (
    <div
      id="modal"
      className="fixed inset-0 w-screen h-[100dvh] bg-black/60 flex justify-center items-center max-[900px]:items-end"
    >
      <div className="w-[1000px] h-[720px] bg-[#212122] rounded-2xl max-[1280px]:w-[800px] max-[1280px]:h-[580px] max-[900px]:w-screen max-[900px]:rounded-none max-[1280px]:text-[16px]">
        <h4
          id="modalTitle"
          className="text-white text-[24px] text-center py-[18px] font-semibold border-b border-white/25"
        >
          {movie.title}
        </h4>
        <button
          id="btnCloseModal"
          className="float-right -mt-14 mr-5 bg-[#383839] px-[13px] py-3 rounded-full"
          onClick={onClose}
        >
          <img className="h-5 w-5" src="/src/assets/buttonX.png" alt="Close" />
        </button>

        <div className="px-[40px] py-[50px] flex gap-10 max-[1280px]:px-[30px] max-[1280px]:py-[40px] max-[900px]:h-[480px] max-[900px]:overflow-y-scroll">
          <img
            alt="Poster"
            id="modalPoster"
            className="max-h-[540px] max-[1280px]:max-h-[400px]"
            src={movie.poster}
          />
          <div className="text-white text-[20px] flex flex-col max-[1280px]:text-[16px]">
            <div className="genres-voteaverage flex items-center gap-2 mb-8">
              <div className="mr-4">{movie.genres}</div>
              <img className="h-5 w-5" src="/src/assets/star.png" alt="Star" />
              {movie.vote_average}
              <button
                type="button"
                className="ml-auto flex h-9 w-9 items-center justify-center"
                aria-label="보고싶은 영화"
                onClick={handleWishlistToggle}
              >
                <img
                  className={
                    isWatchlisted(movie.id)
                      ? "w-5 h-5"
                      : "w-6 h-6"
                  }
                  src={
                    isWatchlisted(movie.id)
                      ? "/src/assets/heart1.svg"
                      : "/src/assets/heart0.svg"
                  }
                  alt="Heart"
                />
              </button>
            </div>

            <div id="modalOverview" className="text-white/90 leading-relaxed">
              {movie.overview}
            </div>

            <div className="myVote mt-auto mb-0 flex items-center gap-6 bg-[#383839] p-6 rounded-2xl">
              <div>내 평점</div>
              <div
                className="myVoteStars flex items-center gap-2"
                onMouseLeave={onVoteMouseLeave}
                onClick={onVoteSave}
              >
                <div
                  className={`myVoteStar flex ${
                    myVote == 0 ? "zero" : myVote == 1 ? "half" : "one"
                  }`}
                >
                  <div onMouseOver={() => onVoteChange(1)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                  <div onMouseOver={() => onVoteChange(2)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                </div>

                <div
                  className={`myVoteStar flex ${
                    myVote <= 2 ? "zero" : myVote == 3 ? "half" : "one"
                  }`}
                >
                  <div onMouseOver={() => onVoteChange(3)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                  <div onMouseOver={() => onVoteChange(4)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                </div>

                <div
                  className={`myVoteStar flex ${
                    myVote <= 4 ? "zero" : myVote == 5 ? "half" : "one"
                  }`}
                >
                  <div onMouseOver={() => onVoteChange(5)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                  <div onMouseOver={() => onVoteChange(6)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                </div>

                <div
                  className={`myVoteStar flex ${
                    myVote <= 6 ? "zero" : myVote == 7 ? "half" : "one"
                  }`}
                >
                  <div onMouseOver={() => onVoteChange(7)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                  <div onMouseOver={() => onVoteChange(8)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                </div>

                <div
                  className={`myVoteStar flex ${
                    myVote <= 8 ? "zero" : myVote == 9 ? "half" : "one"
                  }`}
                >
                  <div onMouseOver={() => onVoteChange(9)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                  <div onMouseOver={() => onVoteChange(10)}>
                    <img src="/src/assets/half_star.png" alt="" />
                    <img src="/src/assets/half_star_off.png" alt="" />
                  </div>
                </div>
              </div>
              <div>{myVote}점</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
