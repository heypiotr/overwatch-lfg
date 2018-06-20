require("./_local");

const syncToken = require("./sync-token").handler;

const context = {
  ACCOUNT_SID: process.env.ACCOUNT_SID,
  TWILIO_API_KEY: process.env.TWILIO_API_KEY,
  TWILIO_API_SECRET: process.env.TWILIO_API_SECRET,
  SYNC_SERVICE_SID: process.env.SYNC_SERVICE_SID
};

const event = {};

syncToken(context, event, (err, result) => {
  console.log("err", err);
  console.log("result", result);
});
