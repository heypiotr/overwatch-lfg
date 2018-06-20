require("./_local");

const bnetAuth = require("./bnet-auth").handler;

const context = {
  BATTLE_NET_CLIENT_ID: process.env.BATTLE_NET_CLIENT_ID,
  BATTLE_NET_CLIENT_SECRET: process.env.BATTLE_NET_CLIENT_SECRET,

  BATTLE_NET_CLIENT_ID_DEV: process.env.BATTLE_NET_CLIENT_ID_DEV,
  BATTLE_NET_CLIENT_SECRET_DEV: process.env.BATTLE_NET_CLIENT_SECRET_DEV
};

const event = {
  code: process.argv[2],
  redirectUri: process.argv[3] || "https://localhost:3000",
  dev: process.argv[4] === "false" ? null : true
};

bnetAuth(context, event, (err, result) => {
  console.log("err", err);
  console.log("result", result);
});
