const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // エントリーポイントを設定 (必要に応じて変更)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',  // 出力ファイル名
  },
  module: {
    rules: [
      {
        test: /\.js$/, // JSファイルの処理
        exclude: /node_modules/,
        use: 'babel-loader',  // 必要に応じてBabelを使用
      },
      {
        test: /\.css$/,  // CSSファイルの処理
        use: ['style-loader', 'css-loader'],
      },
      // 他の必要なローダーを追加
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',  // 作成したindex.htmlを指定
      title: 'My App',           // タイトルなどを設定
      base: '/',                 // ベースパスを設定
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,  // 開発サーバーのポート
  },
};
