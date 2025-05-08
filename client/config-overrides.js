const { addBabelPlugin, override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addBabelPlugin('@babel/plugin-proposal-optional-chaining'),
  addWebpackModuleRule({
    test: /node_modules\/react-confetti/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-optional-chaining'],
      },
    },
  })
);
