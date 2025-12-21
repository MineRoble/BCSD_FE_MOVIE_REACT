import { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';

import './App.css'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
var lastPage = 0;

function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [movies, setMovies] = useState([]);
  const [getModalMovie, setModalMovie] = useState({});
  const [getH4, setH4] = useState("지금 인기있는 영화");
  const [getMyVote, setMyVote] = useState(0);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef();

  const getPopular = async () => {
    console.log(lastPage)
    try {
      const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KOR&page=${lastPage++}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${TMDB_API_KEY}`
            }
          }
      );
      const data = await res.json();
      setMovies([...movies, ...data.results]);
    } catch (err) {
      console.error(err);
    }
  };

  const getSearch = async () => {
    console.log(lastPage)
    try {
      let query = searchRef.current.value;
      if(lastPage > 1) {
        query = getH4.match(/^\"(.*)\" 검색결과$/)[1];
      } else {
        setH4(`"${searchRef.current.value}" 검색결과`);
      }

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=ko-KR&page=${lastPage++}&region=KOR&query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_KEY}`
          }
        }
      );
      const data = await res.json();
      
      if(lastPage > 2) setMovies([...movies, ...data.results]);
      else setMovies(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  let lastFetch = () => {
    if(getH4 == "지금 인기있는 영화") getPopular();
    else getSearch();
  };

  useEffect(() => {
    getPopular();
  }, []);
  
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

  return (
    <>
      <header className={isMobileSearchOpen ? "search-open" : ""}>
          <a href="./">
            <img src="/src/assets/logo.png" alt="Movielist" />
          </a>
          <form id="search" onSubmit={(e) =>  {
            e.preventDefault();
            lastPage = 1;
            getSearch();
          }}>
            <input type="text" name="query" id="searchQuery" placeholder="검색" ref={searchRef} onFocus={() => setMobileSearchOpen(true)} />
            <button id="btnSearch" role="submit" onClick={(e) => {
              if (window.innerWidth <= 480 && !isMobileSearchOpen) {
                setMobileSearchOpen(true);
                e.preventDefault();
              }
            }}>
              <img src="/src/assets/search.png" alt="검색" />
            </button>
          </form>
      </header>
      <main>
          <h4>{getH4}</h4>
          <div id="movies">{movies.map(movie => {
            return (
              <a role="button" className="movie" key={movie.id} onClick={async () => {
                try {
                  const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${encodeURIComponent(movie.id)}?language=ko-KR`,
                    {
                      method: 'GET',
                      headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${TMDB_API_KEY}`
                      }
                    }
                  );
                  const data = await res.json();

                  setModalMovie({
                    "id": movie.id,
                    "poster": "https://image.tmdb.org/t/p/w500"+data["poster_path"],
                    "overview": data["overview"],
                    "title": data["title"],
                    "genres": data.genres.map(genre => genre.name).join(", "),
                    "vote_average": Math.floor(data.vote_average*10)/10
                  });
                  setMyVote(localStorage.getItem(`myvote_${movie.id}`)==null?0:localStorage.getItem(`myvote_${movie.id}`));

                  setModalVisible(true);
                } catch (err) {
                  console.error(err);
                }
              }}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="Poster" />
                <p>{movie.title}</p>
                <div>{Math.floor(movie.vote_average*10)/10} <img src="/src/assets/star.png" /></div>
              </a>
              )
          })}</div>
          <button id="btnMore" onClick={() => {lastFetch();}}>더보기</button>
      </main>

      {isModalVisible && (
        <div id="modal">
          <div>
            <h4 id="modalTitle">{getModalMovie.title}</h4>
            <button id="btnCloseModal" onClick={() => {setModalVisible(false);}}><img src="/src/assets/buttonX.png" alt="Close" /></button>
            <div>
              <img alt="Poster" id="modalPoster" src={getModalMovie.poster}/>
              <div>
                <div className="genres-voteaverage"><div>{getModalMovie.genres}</div> <img src="/src/assets/star.png" alt="Star" /> {getModalMovie.vote_average}</div>
                <div id="modalOverview">{getModalMovie.overview}</div>
                <div className="myVote">
                  <div>내 평점</div>
                  <div
                    className="myVoteStars"
                    onMouseLeave={() => { setMyVote(localStorage.getItem(`myvote_${getModalMovie.id}`)==null?0:localStorage.getItem(`myvote_${getModalMovie.id}`)); }}
                    onClick={() => { localStorage.setItem(`myvote_${getModalMovie.id}`, getMyVote); }}
                  >
                    
                    <div className={`myVoteStar ${getMyVote==0?"zero":getMyVote==1?"half":"one"}`}>
                      <div onMouseOver={() => { setMyVote(1); }}>
                        <img src="/src/assets/half_star.png" alt=""/>
                        <img src="/src/assets/half_star_off.png" alt=""/>
                      </div>
                      <div onMouseOver={() => { setMyVote(2); }}>
                        <img src="/src/assets/half_star.png" alt="" />
                        <img src="/src/assets/half_star_off.png" alt="" />
                      </div>
                    </div>
                    
                    <div className={`myVoteStar ${getMyVote<=2?"zero":getMyVote==3?"half":"one"}`}>
                      <div onMouseOver={() => { setMyVote(3); }}>
                        <img src="/src/assets/half_star.png" alt=""/>
                        <img src="/src/assets/half_star_off.png" alt=""/>
                      </div>
                      <div onMouseOver={() => { setMyVote(4); }}>
                        <img src="/src/assets/half_star.png" alt="" />
                        <img src="/src/assets/half_star_off.png" alt="" />
                      </div>
                    </div>
                    
                    <div className={`myVoteStar ${getMyVote<=4?"zero":getMyVote==5?"half":"one"}`}>
                      <div onMouseOver={() => { setMyVote(5); }}>
                        <img src="/src/assets/half_star.png" alt=""/>
                        <img src="/src/assets/half_star_off.png" alt=""/>
                      </div>
                      <div onMouseOver={() => { setMyVote(6); }}>
                        <img src="/src/assets/half_star.png" alt="" />
                        <img src="/src/assets/half_star_off.png" alt="" />
                      </div>
                    </div>
                    
                    <div className={`myVoteStar ${getMyVote<=6?"zero":getMyVote==7?"half":"one"}`}>
                      <div onMouseOver={() => { setMyVote(7); }}>
                        <img src="/src/assets/half_star.png" alt=""/>
                        <img src="/src/assets/half_star_off.png" alt=""/>
                      </div>
                      <div onMouseOver={() => { setMyVote(8); }}>
                        <img src="/src/assets/half_star.png" alt="" />
                        <img src="/src/assets/half_star_off.png" alt="" />
                      </div>
                    </div>
                    
                    <div className={`myVoteStar ${getMyVote<=8?"zero":getMyVote==9?"half":"one"}`}>
                      <div onMouseOver={() => { setMyVote(9); }}>
                        <img src="/src/assets/half_star.png" alt=""/>
                        <img src="/src/assets/half_star_off.png" alt=""/>
                      </div>
                      <div onMouseOver={() => { setMyVote(10); }}>
                        <img src="/src/assets/half_star.png" alt="" />
                        <img src="/src/assets/half_star_off.png" alt="" />
                      </div>
                    </div>
                    
                  </div>
                  <div>{getMyVote}점</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
