/* eslint no-console: 0 */

const express = require('express');
const path = require('path');
const compression = require('compression');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config');

const app = express();
const http = require('http').Server(app);

app.use(compression());

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: '/',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'app', 'index.html')));
    res.end();
  });

  console.log('[App: App] initialized in Dev mode.');
} else {
  const STATIC_PATH = path.join(__dirname, '..', 'dist');
  const STATIC_OPTS = {
    maxAge: 31536000000, // One year
  };

  app.use(express.static(STATIC_PATH, STATIC_OPTS));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
  console.log('[App: App] initialized.');
}

http.listen(port, () => console.log(`[HTTP Server] Running at http://localhost:${port}`));
