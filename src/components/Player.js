import React from "react";
import "./Player.css";

function Player({ battletag, desc, playmode }) {
  return (
    <div className="Player">
      <div className="Player-battletag">{battletag}</div>
      <div className="Player-desc">{desc}</div>
      <div className="Player-playmode-row">
        wants to play <strong className="Player-playmode">{playmode || "(didn't say)"}</strong>
      </div>
    </div>
  );
}

export default Player;
