import { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';


import movielistLogo from './assets/logo.png'
import searchIcon from './assets/search.png'
import closeBtnIcon from './assets/buttonX.png'
import starIcon from './assets/star.png'
import './App.css'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function App() {
  const [isModalVisible, setModalVisible] = useState(false)
  const [getModalPosterURL, setModalPosterURL] = useState("https://image.tmdb.org/t/p/w500")
  const [getModalOverview, setModalOverview] = useState("")
  const [getModalTitle, setModalTitle] = useState("")
  const [getModalGenres, setModalGenres] = useState("")
  const [getModalStar, setModalStar] = useState(10.0)
  const searchQueryRef = useRef();

  var lastFetch;
  var lastSearchQuery = "";
  var lastPage = 1;
  
  async function getPopular() {
    document.querySelector("main > h4").textContent = `지금 인기있는 영화`;

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
      
      for(let i = 0; i<data.results.length; i++) {
        const item = data.results[i];
        document.getElementById("movies").append(createMovieElement(item));
      }

      lastFetch = getPopular;
    } catch (err) {
      console.error(err);
    }
  }
  
  async function searchMovie(e) {
    e.preventDefault();
    let query = searchQueryRef.current.value;

    // if(document.getElementById("movies").lastChild) {
    //   query = lastSearchQuery;
    // }

    document.querySelector("main > h4").textContent = `"${query}" 검색결과`;

    try {
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
      
      for(let i = 0; i<data.results.length; i++) {
        const item = data.results[i];
        document.getElementById("movies").append(createMovieElement(item));
      }

      lastFetch = searchMovie;
      lastSearchQuery = query;
    } catch (err) {
      console.error(err);
    }
  }

  function createMovieElement(item) {
    const a = document.createElement("a");
    a.href = "#";
    a.classList.add("movie");
    a.dataset.movieid = item.id;

    a.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${encodeURIComponent(e.currentTarget.dataset.movieid)}?language=ko-KR`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${TMDB_API_KEY}`
            }
          }
        );
        const data = await res.json();

        setModalPosterURL(`https://image.tmdb.org/t/p/w500${data["poster_path"]}`);
        setModalOverview(data["overview"]);
        setModalTitle(data["title"]);
        setModalStar(item["vote_average"]);

        setModalGenres(data.genres.map(genre => genre.name).join(", "))

        setModalVisible(true)
      } catch (err) {
        console.error(err);
      }
    });

    const img = document.createElement("img");
    img.src = "https://image.tmdb.org/t/p/w500"+item["poster_path"];
    img.alt = "Poster";

    const p = document.createElement("p");
    p.textContent = item["original_title"];

    const divStar = document.createElement("div");
    divStar.textContent = item["vote_average"];

    const imgStar = document.createElement("img");
    imgStar.src = starIcon;

    divStar.append(imgStar);
    a.append(img);
    a.append(p);
    a.append(divStar);
    return a;
  }

  useEffect(() => {
    getPopular()
  }, []);

  return (
    <>
      <header>
          <a href="./"><img src={movielistLogo} alt="Movielist" /></a>
          <form id="search" onSubmit={searchMovie}>
              <input type="text" name="query" id="searchQuery" placeholder="검색" ref={searchQueryRef} />
              <button id="btnSearch" role="submit"><img src={searchIcon} alt="검색" /></button>
          </form>
      </header>
      <main>
          <h4>지금 인기있는 영화</h4>
          <div id="movies"></div>
          <button id="btnMore">더보기</button>
      </main>

      {isModalVisible && (<div id="modal">
          <div>
              <h4 id="modalTitle">{getModalTitle}</h4>
              <button id="btnCloseModal" onClick={() => setModalVisible(false)}><img src={closeBtnIcon} alt="Close" /></button>
              <div>
                  <img alt="Poster" id="modalPoster" src={getModalPosterURL} />
                  <div>
                      <div><div>{getModalGenres}</div> <img src={starIcon} alt="Star" /> {getModalStar}</div>
                      <div id="modalOverview">{getModalOverview}</div>
                  </div>
              </div>
          </div>
      </div>)}
    </>
  )
}

export default App
