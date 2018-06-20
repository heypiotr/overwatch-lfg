import React from "react";
import { connect } from "react-redux";
import "./App.css";

import {
  getLoginStatus,
  getOwnPlayer,
  getPlayersLoadingStatus,
  getPlayers
} from "../selectors";

import OwnProfile from "./OwnProfile";
import Login from "../components/Login";
import Spinner from "../components/Spinner";
import PlayerList from "../components/PlayerList";

class App extends React.Component {
  render() {
    const pickOwnProfileComponent = () => {
      if (
        this.props.loginStatus === "logged-in" &&
        this.props.ownPlayer != null
      ) {
        const { battletag, desc, playmode, lookingFor } = this.props.ownPlayer;
        return (
          <OwnProfile
            battletag={battletag}
            desc={desc}
            playmode={playmode}
            lookingFor={lookingFor}
          />
        );
      } else if (this.props.loginStatus === "logged-out") {
        return <Login />;
      } else {
        return <Spinner />;
      }
    };
    const ownProfile = pickOwnProfileComponent();

    return (
      <div>
        <div className="App-own-profile">{ownProfile}</div>
        <div className="App-player-lists">
          <PlayerList
            title="Groups looking for players"
            description="This is the quickest way to find a group—just message the group leader and ask for an invite."
            placeholder="There are no groups currently looking for players. How about you start your own?"
            players={this.props.groupLeadersLookingForPlayers}
          />
          <PlayerList
            title="Players looking for groups"
            description="If you want to fill your own group, these players are ready to jump into action, just send them an invite."
            placeholder="There are no players currently looking for a group. Patience! (or maybe join an existing group)"
            players={this.props.playersLookingForGroup}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const props = {
    loginStatus: getLoginStatus(state),
    ownPlayer: getOwnPlayer(state),
    playersLoadingStatus: getPlayersLoadingStatus(state)
  };

  if (props.playersLoadingStatus !== "not-started") {
    Object.assign(props, {
      playersLookingForGroup: getPlayers(state, "group"),
      groupLeadersLookingForPlayers: getPlayers(state, "players")
    });
  }

  return props;
};

export default connect(mapStateToProps)(App);
