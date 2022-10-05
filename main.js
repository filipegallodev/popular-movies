import { URL_DA_API } from "./modules/rote.js";

function initAddMovies(data) {
  const moviesData = data.results;

  const savedFavoritedMovies = JSON.parse(
    localStorage.getItem("favoriteMovies")
  );

  const moviesContainer = document.querySelector(".movies-container");
  const favoriteFilter = document.querySelector(".nav-filter");

  function addMovie(item) {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    function addMovieHeader(item) {
      const movieHeader = document.createElement("div");
      movieHeader.classList.add("movie-header");

      function addMovieImage(item) {
        const movieImgDiv = document.createElement("div");
        movieImgDiv.classList.add("movie-picture");

        const movieImg = document.createElement("img");
        movieImg.src = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
        movieImg.alt = "Poster do Filme";

        movieImgDiv.appendChild(movieImg);
        movieHeader.appendChild(movieImgDiv);
      }

      function addMovieProfile(item) {
        const movieProfile = document.createElement("div");
        movieProfile.classList.add("movie-profile");

        function addMovieTitle(item) {
          const movieTitle = document.createElement("h2");
          movieTitle.innerHTML = item.title;

          const movieYear = document.createElement("span");
          const year = item.release_date.slice(0, 4);
          movieYear.innerHTML = "(" + year + ")";

          const movieTitleDiv = document.createElement("div");
          movieTitleDiv.classList.add("movie-title-container");

          movieTitleDiv.appendChild(movieTitle);
          movieTitleDiv.appendChild(movieYear);

          movieProfile.appendChild(movieTitleDiv);
        }

        addMovieTitle(item);

        function addMovieRating(item) {
          const movieRating = document.createElement("div");
          movieRating.classList.add("movie-rating");

          const ratingDiv = document.createElement("div");
          const ratingStar = document.createElement("img");
          const ratingRange = document.createElement("span");

          ratingStar.src = "../img/star.svg";
          ratingRange.innerHTML = Math.round(item.vote_average * 10) / 10;

          ratingDiv.appendChild(ratingStar);
          ratingDiv.appendChild(ratingRange);

          movieRating.appendChild(ratingDiv);

          function addMovieFavorite(item) {
            const movieFavorite = document.createElement("div");
            movieFavorite.classList.add("favorite-movie");
            movieFavorite.classList.add(`movie-id-${item.id}`);

            const favoriteImg = document.createElement("img");
            const favoriteSpan = document.createElement("span");

            item.id = item.id.toString();

            if (savedFavoritedMovies !== null) {
              const userFavoriteMovies = savedFavoritedMovies.moviesIdsArray;
              if (userFavoriteMovies.includes(item.id)) {
                movieFavorite.classList.add("favoritado");
                favoriteImg.src = "../img/heart-full.svg";
                favoriteSpan.innerHTML = "Desfavoritar";
              } else {
                favoriteImg.src = "../img/heart.svg";
                favoriteSpan.innerHTML = "Favoritar";
              }
            } else {
              favoriteImg.src = "../img/heart.svg";
              favoriteSpan.innerHTML = "Favoritar";
            }

            movieFavorite.appendChild(favoriteImg);
            movieFavorite.appendChild(favoriteSpan);

            movieRating.appendChild(movieFavorite);
          }

          addMovieFavorite(item);

          movieProfile.appendChild(movieRating);
        }

        addMovieRating(item);

        movieHeader.appendChild(movieProfile);
      }

      addMovieImage(item);
      addMovieProfile(item);

      movieElement.appendChild(movieHeader);
    }

    addMovieHeader(item);

    function addMovieDescription(item) {
      const movieDescription = document.createElement("p");

      if (item.overview) {
        const seeMore = document.createElement("span");

        seeMore.classList.add("see-more");
        seeMore.innerHTML = "Ver mais";

        if (item.overview.length > 120) {
          movieDescription.innerHTML = item.overview.slice(0, 120) + "... ";

          movieDescription.appendChild(seeMore);
        } else {
          movieDescription.innerHTML = item.overview;
        }

        seeMore.addEventListener("click", () => {
          movieDescription.innerHTML = item.overview;
        });
      } else {
        movieDescription.innerHTML = "Nenhuma descrição fornecida.";
      }

      movieElement.appendChild(movieDescription);
    }

    addMovieDescription(item);

    moviesContainer.appendChild(movieElement);
  }

  if (moviesData !== undefined) {
    moviesData.forEach((item) => {
      if (favoriteFilter.classList.contains("checked")) {
        item.id = item.id.toString();
        if (savedFavoritedMovies !== null) {
          if (savedFavoritedMovies.moviesIdsArray.length <= 0) {
            addMovie(item);
          } else if (savedFavoritedMovies.moviesIdsArray.includes(item.id)) {
            addMovie(item);
          }
        } else {
          addMovie(item);
        }
      } else {
        addMovie(item);
      }
    });
  } else {
    addMovie(data);
  }

  initFavoriteMovies();
}

async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${URL_DA_API}&language=pt-BR&page=1`;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      initAddMovies(data);
    });
}
getPopularMovies();

async function getFavoriteMovies() {
  const savedFavoritedMovies = JSON.parse(
    localStorage.getItem("favoriteMovies")
  );

  if (savedFavoritedMovies.moviesIdsArray.length >= 1) {
    const userFavoriteMovies = savedFavoritedMovies.moviesIdsArray;

    userFavoriteMovies.forEach((item) => {
      async function addFavoriteMovies(item) {
        const url = `https://api.themoviedb.org/3/movie/${item}?api_key=${URL_DA_API}&language=pt-BR`;

        await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            initAddMovies(data);
          });
      }
      addFavoriteMovies(item);
    });
  }
}

function clearMovieList() {
  const moviesElement = document.querySelectorAll(".movie");

  moviesElement.forEach((item) => {
    item.remove();
  });
}

function initNoResults() {
  const moviesContainer = document.querySelector(".movies-container");

  const noResultsElement = document.createElement("div");
  noResultsElement.classList.add("movie");

  const noResultsTitle = document.createElement("h2");
  noResultsTitle.innerHTML = "Nenhum resultado encontrado.";

  noResultsElement.appendChild(noResultsTitle);

  moviesContainer.appendChild(noResultsElement);
}

function initSearchMovie() {
  function searchMovie() {
    const searchInput = document.querySelector(".movie-search").value;

    if (searchInput !== "") {
      async function getSearchedMovie() {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${URL_DA_API}&language=pt-BR&&query=${searchInput}`;

        await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            clearMovieList();
            if (data.results.length <= 0) {
              initNoResults();
            } else {
              initAddMovies(data);
            }
          });
      }
      getSearchedMovie();
    } else {
      clearMovieList();
      getPopularMovies();
    }
  }

  const searchButton = document.querySelector(".search-button");
  const searchBox = document.querySelector(".movie-search");

  searchButton.addEventListener("click", () => searchMovie());
  searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchMovie();
    }
  });
}
initSearchMovie();

function initFavoriteMovies() {
  const favoriteMovie = document.querySelectorAll(".favorite-movie");

  function addFavoriteMovies(item) {
    const favoriteIcon = item.querySelector("img");
    const favoriteText = item.querySelector("span");

    item.classList.toggle("favoritado");

    if (item.classList.contains("favoritado")) {
      item.classList.remove("desfavoritado");
      favoriteIcon.src = "../img/heart-full.svg";
      favoriteText.innerHTML = "Desfavoritar";

      initUpdateFavoriteMovies();
    } else {
      favoriteIcon.src = "../img/heart.svg";
      favoriteText.innerHTML = "Favoritar";
      item.classList.add("desfavoritado");

      initUpdateFavoriteMovies();
    }
  }

  function initUpdateFavoriteMovies() {
    const savedFavoritedMovies = JSON.parse(
      localStorage.getItem("favoriteMovies")
    );
    if (savedFavoritedMovies !== null) {
      const moviesIdsArray = savedFavoritedMovies.moviesIdsArray;
      updateFavoriteMovies(moviesIdsArray);
    } else {
      const moviesIdsArray = Array();
      updateFavoriteMovies(moviesIdsArray);
    }

    function updateFavoriteMovies(moviesIdsArray) {
      favoriteMovie.forEach((item) => {
        if (
          item.classList.contains("favoritado") ||
          item.classList.contains("desfavoritado")
        ) {
          const movieIdClass = item.classList[1];
          const movieUniqueId = movieIdClass.slice(9, movieIdClass.length);

          if (moviesIdsArray.includes(movieUniqueId)) {
            if (item.classList.contains("desfavoritado")) {
              moviesIdsArray.splice(moviesIdsArray.indexOf(movieUniqueId), 1);
              item.classList.remove("desfavoritado");
            }
          } else {
            moviesIdsArray.push(movieUniqueId);
          }
        }
      });

      localStorage.setItem(
        "favoriteMovies",
        JSON.stringify({ moviesIdsArray })
      );
    }
  }

  favoriteMovie.forEach((item) => {
    item.addEventListener("click", () => addFavoriteMovies(item));
  });
}

function initFavoriteMoviesFilter() {
  const favoriteFilter = document.querySelector(".nav-filter");
  const favoriteFilterBox = favoriteFilter.querySelector("img");

  favoriteFilter.addEventListener("click", () => {
    favoriteFilter.classList.toggle("checked");

    clearMovieList();
    if (favoriteFilter.classList.contains("checked")) {
      favoriteFilterBox.src = "./img/rectangle-full.svg";
      getFavoriteMovies();
    } else {
      favoriteFilterBox.src = "./img/rectangle.svg";
      getPopularMovies();
    }
  });
}
initFavoriteMoviesFilter();
