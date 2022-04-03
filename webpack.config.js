const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const pkg = require('./package.json');

module.exports = {
  entry: './index.js',
  //target: 'webworker',
  devtool: 'source-map',
  plugins: [
    new SentryWebpackPlugin({
      release: `discordgift-${pkg.version}`,
      include: './dist',
      urlPrefix: '/',
      org: "erisadev",
      project: "discordgift",
      authToken: "74f1a768f1d94654a014ab53a62ca45198386801606a4ddaa898e52a2e894f62"
    }),
  ],
};