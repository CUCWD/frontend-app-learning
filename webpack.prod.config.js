const path = require('path');
const { getBaseConfig } = require('@edx/frontend-build');
const CopyPlugin = require('copy-webpack-plugin');

const config = getBaseConfig('webpack-prod');

config.plugins.push(
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, './public/static'),
        to: path.resolve(__dirname, './dist/static'),
      },
    ],
  }),
);

// Filter plugins in the preset config that we don't want
function filterPlugins(plugins) {
  const pluginsToRemove = [
    'a', // "a" is the constructor name of HtmlWebpackNewRelicPlugin
  ];
  return plugins.filter(plugin => {
    const pluginName = plugin.constructor && plugin.constructor.name;
    return !pluginsToRemove.includes(pluginName);
  });
}

config.plugins = filterPlugins(config.plugins);

module.exports = config;
