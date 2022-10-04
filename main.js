import { URL_DA_API } from "./modules/rote.js";

function initAddMovies(data) {
  const moviesData = data.results;

  const savedFavoritedMovies = JSON.parse(
    localStorage.getItem("favoriteMovies")
  );
  const userFavoriteMovies = savedFavoritedMovies.moviesIdsArray;

  const moviesContainer = document.querySelector(".movies-container");

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
          ratingRange.innerHTML = item.vote_average;

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

            if (userFavoriteMovies.includes(item.id)) {
              movieFavorite.classList.add("favoritado");
              favoriteImg.src = "../img/heart-full.svg";
              favoriteSpan.innerHTML = "Desfavoritar";
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

  moviesData.forEach((item) => {
    addMovie(item);
  });

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
      favoriteIcon.src = "../img/heart-full.svg";
      favoriteText.innerHTML = "Desfavoritar";
      console.log(favoriteText.innerHTML)
      updateFavoriteMovies();
    } else {
      favoriteIcon.src = "../img/heart.svg";
      favoriteText.innerHTML = "Favoritar";
      console.log(favoriteText.innerHTML)
      updateFavoriteMovies();
    }
  }

  function updateFavoriteMovies() {
    const userFavoriteMovies = document.querySelectorAll(".favoritado");

    const moviesIdsArray = Array();
    userFavoriteMovies.forEach((item) => {
      const movieIdClass = item.classList[1];
      const movieUniqueId = movieIdClass.slice(9, movieIdClass.length);

      moviesIdsArray.push(movieUniqueId);
    });

    localStorage.setItem("favoriteMovies", JSON.stringify({ moviesIdsArray }));
  }

  favoriteMovie.forEach((item) => {
    item.addEventListener("click", () => addFavoriteMovies(item));
  });
}
