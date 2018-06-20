const got = require("got");

function getBnetToken(code, redirectUri, clientId, clientSecret) {
  return got("https://us.battle.net/oauth/token", {
    form: true,
    body: {
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    },
    auth: `${clientId}:${clientSecret}`
  }).then(res => JSON.parse(res.body).access_token);
}

exports.handler = function(context, event, callback) {
  const dev = event.dev != null;

  const clientId = dev
    ? context.BATTLE_NET_CLIENT_ID_DEV
    : context.BATTLE_NET_CLIENT_ID;

  const clientSecret = dev
    ? context.BATTLE_NET_CLIENT_SECRET_DEV
    : context.BATTLE_NET_CLIENT_SECRET;

  getBnetToken(event.code, event.redirectUri, clientId, clientSecret)
    .then(bnetToken => {
      callback(null, { bnetToken });
    })
    .catch(err => {
      callback(err);
    });
};
