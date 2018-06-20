require("dotenv").config({ path: ".env-backend" });

const Twilio = require("twilio");
const twilioClient = new Twilio(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

function upsertPlayer(id, battletag, desc, playmode, lookingFor) {
  const data = { id, battletag, desc, playmode, lookingFor };

  const playersMap = twilioClient.sync
    .services(process.env.SYNC_SERVICE_SID)
    .syncMaps("players");

  const playerMapItem = playersMap.syncMapItems(id);

  playerMapItem.fetch().then(
    () => {
      playerMapItem.update({ data });
    },
    () => {
      playersMap.syncMapItems.create({ data, key: id });
    }
  );
}

function removePlayer(id) {
  twilioClient.sync
    .services(process.env.SYNC_SERVICE_SID)
    .syncMaps("players")
    .syncMapItems(id)
    .remove();
}

const action = process.argv[2];

if (action === "upsert") {
  const id = process.argv[3];
  const battletag = process.argv[4];
  const desc = process.argv[5];
  const playmode = process.argv[6];
  const lookingFor = process.argv[7];
  upsertPlayer(id, battletag, desc, playmode, lookingFor);
} else if (action === "remove") {
  const id = process.argv[3];
  removePlayer(id);
}
