const AccessToken = Twilio.jwt.AccessToken;

exports.handler = function(context, event, callback) {
  const syncToken = new AccessToken(
    context.ACCOUNT_SID,
    context.TWILIO_API_KEY,
    context.TWILIO_API_SECRET
  );
  syncToken.addGrant(
    new AccessToken.SyncGrant({
      serviceSid: context.SYNC_SERVICE_SID
    })
  );
  syncToken.identity = "guest";

  callback(null, { syncToken: syncToken.toJwt() });
};
