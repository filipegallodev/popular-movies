import { URL_DA_API } from "./rote.js";
import { initAddMovies } from "../main.js";
import { getLocalStorageData } from "./localStorage.js";

const pageTitle = document.querySelector(".page-title");
const userWidthScreen = window.innerWidth;

if(userWidthScreen < 400) {
  const inputPlaceholder = document.querySelector('.movie-search');

  console.log(inputPlaceholder.setAttribute('placeholder', 'Procure por aqui...'));
}

export function getPopularMovies() {
  pageTitle.innerHTML = "Filmes Populares (Top 20)";

  clearMovieList();
  getMoviesFromApi(
    `https://api.themoviedb.org/3/movie/popular?api_key=${URL_DA_API}&language=pt-BR&page=1`
  );
}

export function getSearchedMovie() {
  pageTitle.innerHTML = "Resultados";

  const searchInput = document.querySelector(".movie-search").value;

  if (searchInput !== "") {
    clearMovieList();
    getMoviesFromApi(
      `https://api.themoviedb.org/3/search/movie?api_key=${URL_DA_API}&language=pt-BR&&query=${searchInput}`
    );
  } else {
    getPopularMovies();
  }
}

export function getFavoriteMovies() {
  pageTitle.innerHTML = "Meus Favoritos";

  const userFavoriteMoviesIds = getLocalStorageData().favoriteMoviesIds;

  clearMovieList();
  if (userFavoriteMoviesIds.length >= 1) {
    userFavoriteMoviesIds.forEach((movieId) => {
      getMoviesFromApi(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${URL_DA_API}&language=pt-BR`
      );
    });
  }
}

async function getMoviesFromApi(url) {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (
        data === "" ||
        (data.results !== undefined && data.results.length <= 0)
      ) {
        return noSearchResults();
      }
      return initAddMovies(data);
    });
}

export function clearMovieList() {
  const moviesElement = document.querySelectorAll(".movie");

  moviesElement.forEach((item) => {
    item.remove();
  });
}

function noSearchResults() {
  const moviesContainer = document.querySelector(".movies-container");

  const noResultsElement = document.createElement("div");
  noResultsElement.classList.add("movie");

  const noResultsTitle = document.createElement("h2");
  noResultsTitle.innerHTML = "Nenhum filme encontrado.";

  noResultsElement.appendChild(noResultsTitle);
  moviesContainer.appendChild(noResultsElement);
}
