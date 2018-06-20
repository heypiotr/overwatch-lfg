require("dotenv").config({ path: "../.env-backend" });

const Twilio = require("twilio");
global.Twilio = Twilio;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

if (accountSid && authToken) {
  global.twilioClient = new Twilio(accountSid, authToken);
}
