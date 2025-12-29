import { Link } from 'react-router-dom';

export default function Header({
  isMobileSearchOpen,
  searchRef,
  onSearchSubmit,
  onSearchButtonClick,
  onSearchFocus,
}) {
  const isLoggedIn = Boolean(localStorage.getItem("movielistAuth"));

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("movielistAuth");
    }
  };

  return (
    <header
      className={`px-6 py-5 pb-2 border-b border-white/50 shadow-[0_4px_8px_0_rgba(255,255,255,0.2)] flex items-center justify-between gap-6 max-[480px]:gap-0 ${
        isMobileSearchOpen ? "" : ""
      }`}
    >
      <a
        href="/"
        className={`shrink-0 ${isMobileSearchOpen ? "max-[480px]:hidden" : ""}`}
      >
        <img className="h-7" src="/src/assets/logo.png" alt="Movielist" />
      </a>
      <div className="flex items-start">
        <form
          id="search"
          className={`bg-white px-[14px] py-[10px] rounded-lg flex items-center gap-2 ${
            isMobileSearchOpen ? "max-[480px]:w-full" : ""
          }`}
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
          <input
            className={`w-[260px] text-[16px] font-['Roboto'] border-0 outline-none max-[1280px]:w-[200px] max-[900px]:w-[160px] ${
              isMobileSearchOpen
                ? "max-[480px]:block max-[480px]:w-full"
                : "max-[480px]:hidden"
            }`}
            type="text"
            name="query"
            id="searchQuery"
            placeholder="검색"
            ref={searchRef}
            onFocus={onSearchFocus}
          />
          <button
            className="shrink-0"
            id="btnSearch"
            role="submit"
            onClick={onSearchButtonClick}
          >
            <img className="h-5 w-5" src="/src/assets/search.png" alt="검색" />
          </button>
        </form>
        <div className="relative ml-2 group max-[480px]:hidden">
          <button
            type="button"
            aria-label="프로필"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black/80 shadow-sm ring-1 ring-black/10"
          >
            <img src="/src/assets/user.svg" className='h-full w-full p-3 object-contain' />
          </button>

          <div className="absolute pt-4 -right-1 top-full z-50 opacity-0 invisible pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto relative before:content-[''] before:absolute before:-top-3 before:left-0 before:h-3 before:w-full">
            <div className="relative">
              <div
                className="absolute right-4 -top-2 h-4 w-4 bg-white"
                style={{ transform: "rotate(45deg)" }}
              />

              <div className="w-44 absolute -right-1 overflow-hidden rounded-2xl bg-white shadow-xl">
                <Link
                  to="/login"
                  onClick={handleAuthClick}
                  className={`block w-full px-5 py-3 text-center text-[16px] font-extrabold tracking-tight cursor-pointer max-[900px]:px-4 max-[900px]:py-2.5 max-[900px]:text-[15px] max-[640px]:px-3 max-[640px]:py-2 max-[640px]:text-[14px] ${
                    isLoggedIn ? "text-[#F33F3F]" : "text-black/90"
                  }`}
                >
                  {isLoggedIn ? "로그아웃" : "로그인"}
                </Link>
                <div className="h-px w-full bg-black/15" />
                {isLoggedIn ? (
                  <Link
                    to="/mypage"
                    className="block w-full px-5 py-3 text-center text-[16px] font-extrabold tracking-tight cursor-pointer text-black/90 max-[900px]:px-4 max-[900px]:py-2.5 max-[900px]:text-[15px] max-[640px]:px-3 max-[640px]:py-2 max-[640px]:text-[14px]"
                  >
                    마이페이지
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="block w-full px-5 py-3 text-center text-[16px] font-extrabold tracking-tight cursor-pointer text-black/90 max-[900px]:px-4 max-[900px]:py-2.5 max-[900px]:text-[15px] max-[640px]:px-3 max-[640px]:py-2 max-[640px]:text-[14px]"
                  >
                    회원가입
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
