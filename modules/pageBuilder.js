import { getLocalStorageData } from "./localStorage.js";

const moviesContainer = document.querySelector(".movies-container");

export function addMovie(movieData) {
  const userLocalStorage = getLocalStorageData();

  const movieElement = document.createElement("div");
  movieElement.classList.add("movie");

  function addMovieHeader(movieData) {
    const movieHeader = document.createElement("div");
    movieHeader.classList.add("movie-header");

    function addMovieImage(movieData) {
      const movieImgDiv = document.createElement("div");
      movieImgDiv.classList.add("movie-picture");

      const movieImg = document.createElement("img");
      if (movieData.poster_path !== null) {
        movieImg.src = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
      } else {
        movieImg.src = "../img/no-cover-available.jpg";
      }
      movieImg.alt = "Poster do Filme";

      movieImgDiv.appendChild(movieImg);
      movieHeader.appendChild(movieImgDiv);
    }

    function addMovieProfile(movieData) {
      const movieProfile = document.createElement("div");
      movieProfile.classList.add("movie-profile");

      function addMovieTitle(movieData) {
        const movieTitle = document.createElement("h2");
        movieTitle.innerHTML = movieData.title;

        const movieYear = document.createElement("span");
        const year = movieData.release_date.slice(0, 4);

        if (year !== "") {
          movieYear.innerHTML = "(" + year + ")";
        } else {
          movieYear.innerHTML = "( ? )";
        }

        const movieTitleDiv = document.createElement("div");
        movieTitleDiv.classList.add("movie-title-container");

        movieTitleDiv.appendChild(movieTitle);
        movieTitleDiv.appendChild(movieYear);

        movieProfile.appendChild(movieTitleDiv);
      }

      addMovieTitle(movieData);

      function addMovieRating(movieData) {
        const movieRating = document.createElement("div");
        movieRating.classList.add("movie-rating");

        const ratingDiv = document.createElement("div");
        const ratingStar = document.createElement("img");
        const ratingRange = document.createElement("span");

        ratingStar.src = "../img/star.svg";
        ratingRange.innerHTML = Math.round(movieData.vote_average * 10) / 10;

        ratingDiv.appendChild(ratingStar);
        ratingDiv.appendChild(ratingRange);

        movieRating.appendChild(ratingDiv);

        function addMovieFavorite(movieData) {
          const movieFavorite = document.createElement("div");
          movieFavorite.classList.add("favorite-movie");
          movieFavorite.classList.add(`movie-id-${movieData.id}`);

          const favoriteImg = document.createElement("img");
          const favoriteSpan = document.createElement("span");

          movieData.id = movieData.id.toString();

          if (userLocalStorage !== null && userLocalStorage !== undefined) {
            const userFavoriteMovies = userLocalStorage.favoriteMoviesIds;

            if (userFavoriteMovies.includes(movieData.id)) {
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

        addMovieFavorite(movieData);

        movieProfile.appendChild(movieRating);
      }

      addMovieRating(movieData);

      movieHeader.appendChild(movieProfile);
    }

    addMovieImage(movieData);
    addMovieProfile(movieData);

    movieElement.appendChild(movieHeader);
  }

  addMovieHeader(movieData);

  function addMovieDescription(movieData) {
    const movieDescription = document.createElement("p");

    if (movieData.overview) {
      const seeMore = document.createElement("span");

      seeMore.classList.add("see-more");
      seeMore.innerHTML = "Ver mais";

      if (movieData.overview.length > 120) {
        movieDescription.innerHTML = movieData.overview.slice(0, 120) + "... ";

        movieDescription.appendChild(seeMore);
      } else {
        movieDescription.innerHTML = movieData.overview;
      }

      seeMore.addEventListener("click", () => {
        movieDescription.innerHTML = movieData.overview;
      });
    } else {
      movieDescription.innerHTML = "Nenhuma descrição fornecida.";
    }

    movieElement.appendChild(movieDescription);
  }

  addMovieDescription(movieData);

  moviesContainer.appendChild(movieElement);
}
