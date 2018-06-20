import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import "./OwnProfile.css";

import { getBnetToken } from "../selectors";

import { updateOwnPlayer } from "../helpers/syncClient";

class OwnProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      desc: props.desc,
      playmode: props.playmode,
      lookingFor: props.lookingFor
    };

    this.updateOwnPlayer = updateOwnPlayer.bind(this, props.bnetToken);
  }

  handleDescChange = e => {
    this.setState({ desc: e.target.value });
  };

  handleDescBlur = e => {
    this.updateOwnPlayer({ desc: this.state.desc });
  };

  handlePlaymodeChange = e => {
    this.setState({ playmode: e.target.value });
    this.updateOwnPlayer({ playmode: e.target.value });
  };

  handleLookingForPlayersClick = e => {
    this.setState({ lookingFor: "players" });
    this.updateOwnPlayer({ lookingFor: "players" });
  };

  handleLookingForGroupClick = e => {
    this.setState({ lookingFor: "group" });
    this.updateOwnPlayer({ lookingFor: "group" });
  };

  handleDelistClick = e => {
    this.setState({ lookingFor: null });
    this.updateOwnPlayer({ lookingFor: null });
  };

  render() {
    const isListed = this.state.lookingFor != null;

    return (
      <div className="OwnProfile">
        <div className="OwnProfile-player-info">
          <div className="OwnProfile-battletag">{this.props.battletag}</div>
          <div className="OwnProfile-desc">
            <textarea
              className="OwnProfile-desc-input"
              placeholder="(more about you or your group)"
              value={this.state.desc}
              onChange={this.handleDescChange}
              onBlur={this.handleDescBlur}
            />
          </div>
          <div className="OwnProfile-playmode">
            wants to play&nbsp;
            <select
              className="OwnProfile-playmode-select"
              value={this.state.playmode}
              onChange={this.handlePlaymodeChange}
            >
              <option />
              <option>Quick Play</option>
              <option>Competetive</option>
              <option>Arcade</option>
            </select>
          </div>
        </div>
        <div className="OwnProfile-list-buttons">
          {this.state.lookingFor !== "group" && (
            <button
              className={classNames("OwnProfile-button", {
                "OwnProfile-button-disabled": isListed
              })}
              onClick={this.handleLookingForPlayersClick}
            >
              LF players to join my group
            </button>
          )}
          {this.state.lookingFor !== "players" && (
            <button
              className={classNames("OwnProfile-button", {
                "OwnProfile-button-disabled": isListed
              })}
              onClick={this.handleLookingForGroupClick}
            >
              LF for a group to join
            </button>
          )}
          {isListed && (
            <button
              className="OwnProfile-button OwnProfile-delist-button"
              onClick={this.handleDelistClick}
            >
              Not looking anymore
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    bnetToken: getBnetToken(state)
  };
};

export default connect(mapStateToProps)(OwnProfile);
