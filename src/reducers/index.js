const initialState = {
  loginStatus: "unknown", // unknown, logged-in, logged-out
  bnetToken: null,
  bnetIdentity: null,

  players: {},
  playersLoadingStatus: "not-started" // not-started, started, finished
};

// import testState from "../testState";
// const initialState = testState;

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOGGED_IN":
      return {
        ...state,
        loginStatus: "logged-in",
        bnetToken: action.bnetToken,
        bnetIdentity: action.bnetIdentity
      };

    case "SET_LOGGED_OUT":
      return {
        ...state,
        loginStatus: "logged-out",
        bnetToken: null,
        bnetIdentity: null
      };

    case "SET_PLAYERS_LOADING_STATUS":
      return { ...state, playersLoadingStatus: action.playersLoadingStatus };

    case "ADD_PLAYER":
      return {
        ...state,
        players: {
          ...state.players,
          [action.playerId]: action.playerData
        }
      };

    case "REMOVE_PLAYER":
      const { [action.playerId]: value, ...rest } = state.players;
      return {
        ...state,
        players: rest
      };

    case "UPDATE_PLAYER":
      return {
        ...state,
        players: {
          ...state.players,
          [action.playerId]: {
            ...state.players[action.playerId],
            ...action.playerData
          }
        }
      };

    default:
      return state;
  }
};
