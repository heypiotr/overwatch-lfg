const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  // change this if you've set up your own Battle.net client,
  // and your own Twilio Function for Battle.net authentication
  app.use(proxy('/api/bnet-auth', {
    target: 'https://stormcloud-mongoose-4373.twil.io',
    changeOrigin: true,
    pathRewrite: {'^/api': ''}
  }));

  // change this if you've set up your own Twilio Sync environment
  app.use(proxy('/api', {
    target: 'https://stormcloud-mongoose-4373.twil.io',
    changeOrigin: true,
    pathRewrite: {'^/api': ''}
  }));
};
