import * as fs from 'fs';
import { isSsl } from '../settings';

export interface ICerts 
{
    key  : Buffer;
    cert : Buffer;
} 

let certs : ICerts | undefined = undefined;

if(isSsl)
{
    certs = {
        key: fs.readFileSync('./security/key-rsa.pem'),
        cert: fs.readFileSync('./security/cert.pem')
    }
}

export {certs};