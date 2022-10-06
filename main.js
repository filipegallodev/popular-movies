import { addMovie } from "./modules/pageBuilder.js";
import {
  getPopularMovies,
  getFavoriteMovies,
  getSearchedMovie,
} from "./modules/getMovies.js";
import {
  getLocalStorageData,
  verifyLocalStorage,
} from "./modules/localStorage.js";

export function initAddMovies(data) {
  const favoriteFilterOption = document.querySelector(".nav-filter");
  const searchInput = document.querySelector(".movie-search").value;

  if (data.results !== undefined) {
    for (let movie = 0; movie < data.results.length; movie++) {
      if (favoriteFilterOption.classList.contains("checked")) {
        searchIntoFavoriteMovies(data.results[movie]);

        if (searchInput === "") {
          getFavoriteMovies();
          break;
        }
      } else {
        addMovie(data.results[movie]);
      }
    }
  } else {
    addMovie(data);
  }

  initFavoriteMoviesButtons();
}

function searchIntoFavoriteMovies(movie) {
  const userLocalStorage = getLocalStorageData();

  if (
    userLocalStorage !== null &&
    userLocalStorage !== undefined &&
    userLocalStorage.favoriteMoviesIds.includes(movie.id.toString())
  ) {
    addMovie(movie);
  }
}

function initMovieSearch() {
  const searchBox = document.querySelector(".movie-search");
  const searchButton = document.querySelector(".search-button");

  searchButton.addEventListener("click", () => getSearchedMovie());
  searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      getSearchedMovie();
    }
  });
}

function initFavoriteMoviesButtons() {
  const movieFavoriteButtons = document.querySelectorAll(".favorite-movie");

  function manageFavoriteMovies(item) {
    const favoriteIcon = item.querySelector("img");
    const favoriteText = item.querySelector("span");

    item.classList.toggle("favoritado");

    if (item.classList.contains("favoritado")) {
      item.classList.remove("desfavoritado");
      favoriteIcon.src = "../img/heart-full.svg";
      favoriteText.innerHTML = "Desfavoritar";

      verifyLocalStorage(movieFavoriteButtons);
    } else {
      favoriteIcon.src = "../img/heart.svg";
      favoriteText.innerHTML = "Favoritar";
      item.classList.add("desfavoritado");

      verifyLocalStorage(movieFavoriteButtons);
    }
  }

  movieFavoriteButtons.forEach((item) => {
    item.addEventListener("click", () => manageFavoriteMovies(item));
  });
}

function initFavoriteMoviesFilter() {
  const favoriteFilterOption = document.querySelector(".nav-filter");
  const favoriteFilterBox = favoriteFilterOption.querySelector("img");

  favoriteFilterOption.addEventListener("click", () => {
    favoriteFilterOption.classList.toggle("checked");

    if (favoriteFilterOption.classList.contains("checked")) {
      favoriteFilterBox.src = "./img/rectangle-full.svg";
      getFavoriteMovies();
    } else {
      favoriteFilterBox.src = "./img/rectangle.svg";
      getPopularMovies();
    }
  });
}

getPopularMovies();
initMovieSearch();
initFavoriteMoviesFilter();
