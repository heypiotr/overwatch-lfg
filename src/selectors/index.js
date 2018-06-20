export function getLoginStatus(state) {
  return state.loginStatus;
}

export function getBnetToken(state) {
  return state.bnetToken;
}

export function getOwnPlayer(state) {
  if (state.bnetIdentity == null) {
    return null;
  }
  return state.players[state.bnetIdentity.id];
}

export function getPlayersLoadingStatus(state) {
  return state.playersLoadingStatus;
}

export function getPlayers(state, lookingFor) {
  return Object.values(state.players).filter(
    player => player.lookingFor === lookingFor
  );
}
