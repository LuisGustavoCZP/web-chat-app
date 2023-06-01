import https from 'https';
import http from 'http';

import {certs} from "./ssl";

export class Server
{
  instance;
  start;

  constructor (app : any, {port, isSsl} : {port : number, isSsl : boolean})
  {
    this.instance = isSsl ? https.createServer(certs!, app) : http.createServer(app);
    
    this.start = () => 
    {
      this.instance.listen(port, () => 
      {
        console.log(`Server is listening on ${certs?"https":"http"}://localhost:${port}`);
      });
    }
  }
}