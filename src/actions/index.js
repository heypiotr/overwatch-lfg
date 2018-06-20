export const setLoggedIn = (bnetToken, bnetIdentity) => ({
  type: "SET_LOGGED_IN",
  bnetToken,
  bnetIdentity
});

export const setLoggedOut = () => ({ type: "SET_LOGGED_OUT" });

export const setPlayersLoadingStatus = playersLoadingStatus => ({
  type: "SET_PLAYERS_LOADING_STATUS",
  playersLoadingStatus
});

export const addPlayer = (playerId, playerData) => ({
  type: "ADD_PLAYER",
  playerId,
  playerData
});

export const removePlayer = playerId => ({
  type: "REMOVE_PLAYER",
  playerId
});

export const updatePlayer = (playerId, playerData) => ({
  type: "UPDATE_PLAYER",
  playerId,
  playerData
});
