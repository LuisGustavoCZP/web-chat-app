const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const { port, isSsl } = require('./configs');
const router = require('./router');
const socket = require('./socket');

const app = express();

app.use('/', router);

function startHttps (app)
{
  const key = fs.readFileSync('./security/key-rsa.pem');
  const cert = fs.readFileSync('./security/cert.pem');
  return https.createServer({ key, cert }, app)
}

const server = isSsl ? startHttps(app) : http.createServer(app);

socket(server);

server.listen(port, err => {
  if (err) {
    console.log('Well, this didn\'t work...');
    process.exit();
  }
  console.log('Server is listening on port ' + port);
});

module.exports = app;