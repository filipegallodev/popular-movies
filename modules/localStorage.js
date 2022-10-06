export function verifyLocalStorage(movieFavoriteButtons) {
  const userLocalStorage = getLocalStorageData();

  if (userLocalStorage !== null) {
    updateFavoriteMovies(
      movieFavoriteButtons,
      userLocalStorage.favoriteMoviesIds
    );
  } else {
    const userFavoriteMoviesIds = Array();
    updateFavoriteMovies(movieFavoriteButtons, userFavoriteMoviesIds);
  }
}

function updateFavoriteMovies(movieFavoriteButtons, userFavoriteMoviesIds) {
  movieFavoriteButtons.forEach((favoriteButton) => {
    if (
      favoriteButton.classList.contains("favoritado") ||
      favoriteButton.classList.contains("desfavoritado")
    ) {
      const htmlMovieId = favoriteButton.classList[1].slice(
        9,
        favoriteButton.classList[1].length
      );

      if (userFavoriteMoviesIds.includes(htmlMovieId)) {
        if (favoriteButton.classList.contains("desfavoritado")) {
          userFavoriteMoviesIds.splice(userFavoriteMoviesIds.indexOf(htmlMovieId), 1);
          favoriteButton.classList.remove("desfavoritado");
        }
      } else {
        userFavoriteMoviesIds.push(htmlMovieId);
      }
    }
  });

  setLocalStorageData(userFavoriteMoviesIds);
}

export function getLocalStorageData() {
  return JSON.parse(localStorage.getItem("favoriteMovies"));
}

export function setLocalStorageData(favoriteMoviesIds) {
  localStorage.setItem("favoriteMovies", JSON.stringify({ favoriteMoviesIds }));
}
