import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';

const GENRES = [
  "액션",
  "어드벤처",
  "애니메이션",
  "코미디",
  "범죄",
  "다큐멘터리",
  "드라마",
  "가족",
  "판타지",
  "역사",
  "공포",
  "음악",
  "미스터리",
  "로맨스",
  "SF",
  "스릴러",
  "TV 영화",
  "전쟁",
  "서부극",
];

function SignupPage() {
  const navigate = useNavigate();
  const searchRef = useRef();
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  const handleSearchSubmit = () => {
    const rawQuery = searchRef.current?.value?.trim() ?? "";
    if (!rawQuery) {
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

  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    setGenres((prev) => {
      if (checked) {
        return [...prev, value];
      }
      return prev.filter((genre) => genre !== value);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.username ||
      !form.password ||
      !form.passwordConfirm ||
      !form.nickname
    ) {
      setError("모든 항목을 입력하세요.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (genres.length === 0) {
      setError("선호 장르를 하나 이상 선택하세요.");
      return;
    }

    localStorage.setItem(
      "movielistUser",
      JSON.stringify({
        username: form.username,
        password: form.password,
        nickname: form.nickname,
        genres,
      })
    );
    localStorage.setItem("movielistAuth", form.username);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        isMobileSearchOpen={isMobileSearchOpen}
        searchRef={searchRef}
        onSearchSubmit={handleSearchSubmit}
        onSearchButtonClick={handleSearchButtonClick}
        onSearchFocus={() => setMobileSearchOpen(true)}
      />

      <main className="px-6 py-16">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-xl font-semibold">회원가입</h1>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <input
              id="username"
              type="text"
              placeholder="아이디"
              className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-sm text-white outline-none focus:border-white/50"
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
            />
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-sm text-white outline-none focus:border-white/50"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
            <input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호 재입력"
              className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-sm text-white outline-none focus:border-white/50"
              value={form.passwordConfirm}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  passwordConfirm: event.target.value,
                }))
              }
            />
            <input
              id="nickname"
              type="text"
              placeholder="닉네임"
              className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-sm text-white outline-none focus:border-white/50"
              value={form.nickname}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, nickname: event.target.value }))
              }
            />
            <div className="pt-2">
              <p className="mb-2 text-sm text-white/70">선호 장르 (복수선택)</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm max-[480px]:grid-cols-1">
                {GENRES.map((genre) => (
                  <label key={genre} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="favoriteGenres"
                      value={genre}
                      checked={genres.includes(genre)}
                      onChange={handleGenreChange}
                    />
                    <span>{genre}</span>
                  </label>
                ))}
              </div>
            </div>
            {error ? <p className="text-xs text-[#F33F3F]">{error}</p> : null}
            <button
              type="submit"
              className="mt-4 w-full bg-[#F33F3F] py-2 text-sm font-semibold text-white"
            >
              회원가입
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;
