const express = require('express');
const https = require('https');
const fs = require('fs');

const { port } = require('./config');
const router = require('./router');
const socket = require('./socket');

class App {
  express;
  constructor() {
    this.startServer();
  }
  startServer() {
    this.express = express();
    const key = fs.readFileSync('./security/key-rsa.pem');
    const cert = fs.readFileSync('./security/cert.pem');
    //  Set up routes (and middlewares if we had any)

    this.express.use('/', router);
    //  Server creation starts here
    const server = https.createServer({ key, cert }, this.express);     

    socket(server);

    server.listen(port, err => {
      if (err) {
        console.log('Well, this didn\'t work...');
        process.exit();
      }
      console.log('Server is listening on port ' + port);
    });
  }
}

module.exports = new App().express;