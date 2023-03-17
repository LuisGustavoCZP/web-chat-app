import * as fs from 'fs';

const key = fs.readFileSync('./security/key-rsa.pem');
const cert = fs.readFileSync('./security/cert.pem');

export {key, cert};