import React from "react";
import "./PlayerList.css";

import Player from "./Player";
import Spinner from "./Spinner";

function PlayerList({ title, description, placeholder, players }) {
  const playerItems = (() => {
    if (players == null) {
      return <Spinner />;
    } else if (players.length > 0) {
      return players.map(player => (
        <div className="PlayerList-item" key={player.id}>
          <Player
            battletag={player.battletag}
            desc={player.desc}
            playmode={player.playmode}
          />
        </div>
      ));
    } else {
      return <span className="PlayerList-no-players">{placeholder}</span>;
    }
  })();

  return (
    <div className="PlayerList">
      <h3 className="PlayerList-title">{title}</h3>
      <p className="PlayerList-description">{description}</p>
      <div className="PlayerList-players">{playerItems}</div>
    </div>
  );
}

export default PlayerList;
