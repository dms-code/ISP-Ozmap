const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  optimization: {
    minimize: false,
  },
  entry: './src/index.ts',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals({
    allowlist: ['@ozmap/ozmap-sdk', '@ozmap/ozmap-sdk-original']
  })],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@ozmap/ozmap-sdk': path.resolve(__dirname, './src/mocks/ozmap-sdk.ts'),
      '@ozmap/ozmap-sdk-original': require.resolve('@ozmap/ozmap-sdk'),      // always points to the real SDK
    
    }  
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
