import React from "react";
import ReactDOM from "react-dom";

// import registerServiceWorker from "./registerServiceWorker";
// registerServiceWorker();

import "sanitize.css/sanitize.css";
import "./index.css";

import "url-search-params-polyfill";

import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import { Provider } from "react-redux";
import rootReducer from "./reducers";

import {
  setLoggedIn,
  setLoggedOut,
  setPlayersLoadingStatus,
  addPlayer,
  removePlayer,
  updatePlayer
} from "./actions";

import { performBnetAuth } from "./helpers/bnetAuth";
import {
  setupSyncClient,
  forEachItem,
  updateOwnPlayer
} from "./helpers/syncClient";

import App from "./containers/App";

const store = createStore(rootReducer, applyMiddleware(logger));

performBnetAuth().then(bnetAuth => {
  if (bnetAuth != null) {
    const { bnetToken, bnetIdentity } = bnetAuth;
    store.dispatch(setLoggedIn(bnetToken, bnetIdentity));
    updateOwnPlayer(bnetToken, {
      id: bnetIdentity.id,
      battletag: bnetIdentity.battletag
    });
  } else {
    store.dispatch(setLoggedOut());
  }
});

setupSyncClient()
  .then(syncClient => syncClient.map("players"))
  .then(playersMap => {
    forEachItem(playersMap, playerItem => {
      store.dispatch(setPlayersLoadingStatus("started"));
      // populate the initial content
      store.dispatch(addPlayer(playerItem.key, playerItem.value));
    }).then(() => {
      store.dispatch(setPlayersLoadingStatus("finished"));
      // then listen for changes
      playersMap.on("itemAdded", event => {
        store.dispatch(addPlayer(event.item.key, event.item.value));
      });
      playersMap.on("itemRemoved", event => {
        store.dispatch(removePlayer(event.key));
      });
      playersMap.on("itemUpdated", event => {
        store.dispatch(updatePlayer(event.item.key, event.item.value));
      });
    });
  });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
