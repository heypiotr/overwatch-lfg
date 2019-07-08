const got = require("got");

function getBnetIdentity(accessToken) {
  return got("https://us.battle.net/oauth/userinfo", {
    json: true,
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(res => res.body);
}

function upsertPlayer(playersMap, playerItem, newPlayerData, playerId) {
  return playerItem.fetch().then(
    currentPlayerItem =>
      playerItem.update({
        data: Object.assign(currentPlayerItem.data, newPlayerData)
      }),
    () => playersMap.syncMapItems.create({ data: newPlayerData, key: playerId })
  );
}

function validatedPlayerData(playerData, bnetIdentity) {
  let validatedPlayerData = {};
  if (playerData.id === bnetIdentity.id) {
    validatedPlayerData.id = playerData.id;
  }
  if (playerData.battletag === bnetIdentity.battletag) {
    validatedPlayerData.battletag = playerData.battletag;
  }
  if (typeof playerData.desc === "string" && playerData.desc.length <= 80) {
    validatedPlayerData.desc = playerData.desc;
  }
  if (
    typeof playerData.playmode === "string" &&
    ["", "Quick Play", "Competetive", "Arcade"].includes(playerData.playmode)
  ) {
    validatedPlayerData.playmode = playerData.playmode;
  }
  if (
    playerData.lookingFor === null ||
    (typeof playerData.lookingFor === "string" &&
      ["group", "players"].includes(playerData.lookingFor))
  ) {
    validatedPlayerData.lookingFor = playerData.lookingFor;
  }
  return validatedPlayerData;
}

exports.handler = function(context, event, callback) {
  const bnetToken = event.bnetToken;
  if (!bnetToken) {
    return callback("Missing Battle.net access token");
  }

  const newPlayerData = event.newPlayerData;

  getBnetIdentity(bnetToken)
    .then(bnetIdentity => {
      const playerId = bnetIdentity.id;

      const playersMap = twilioClient.sync
        .services(context.SYNC_SERVICE_SID)
        .syncMaps("players");
      const playerItem = playersMap.syncMapItems(playerId);

      if (newPlayerData == null) {
        // remove own player from the map
        return playerItem.remove();
      } else {
        // update own player data
        return upsertPlayer(
          playersMap,
          playerItem,
          validatedPlayerData(newPlayerData, bnetIdentity),
          playerId
        );
      }
    })
    .then(() => callback())
    .catch(err => callback(err));
};
