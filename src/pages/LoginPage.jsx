import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';

function LoginPage() {
  const navigate = useNavigate();
  const searchRef = useRef();
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const savedUser = localStorage.getItem("movielistUser");
    if (!savedUser) {
      setError("가입된 계정이 없습니다.");
      return;
    }

    const user = JSON.parse(savedUser);
    const savedUserId = user.username ?? user.email;
    if (savedUserId !== form.username || user.password !== form.password) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    localStorage.setItem("movielistAuth", savedUserId);
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
          <h1 className="text-xl font-semibold">로그인</h1>

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
            {error ? <p className="text-xs text-[#F33F3F]">{error}</p> : null}
            <button
              type="submit"
              className="mt-4 w-full bg-[#F33F3F] py-2 text-sm font-semibold text-white"
            >
              로그인
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
