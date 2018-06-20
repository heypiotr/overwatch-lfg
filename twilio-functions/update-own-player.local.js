require("./_local");

const updateOwnPlayer = require("./update-own-player").handler;

const context = {
  SYNC_SERVICE_SID: process.env.SYNC_SERVICE_SID
};

const event = {
  bnetToken: process.argv[2],
  newPlayerData: JSON.parse(process.argv[3])
};

updateOwnPlayer(context, event, (err, result) => {
  console.log("err", err);
  console.log("result", result);
});
