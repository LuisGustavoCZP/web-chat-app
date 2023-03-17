import https from 'https';
import http from 'http';

import * as ssl from "./ssl";

export class Server
{
  instance;
  start;

  constructor (app : any, {port, isSsl} : {port : number, isSsl : boolean})
  {
    this.instance = isSsl ? https.createServer(ssl, app) : http.createServer(app);
    
    this.start = () => 
    {
      this.instance.listen(port, () => 
      {
        console.log(`Server is listening on ${ssl?"https":"http"}://localhost:${port}`);
      });
    }
  }
}