const express = require('express');
const fs = require('fs');

/* 
const style = fs.readFileSync('./public/style.css');
const page = fs.readFileSync('./public/index.html');
const script = fs.readFileSync('./public/index.js'); 
 */

const logo = fs.readFileSync('./public/logo.png');
const router = express.Router();

router.use('/logo.png', (req, res) => {
    res.send(logo);
});

router.use('/favicon.png', (req, res) => {
    res.send(logo);
});

router.use('/', (req, res) => 
{

    const style = fs.readFileSync('./public/style.css');
    const page = fs.readFileSync('./public/index.html');
    const script = fs.readFileSync('./public/index.js');

    res.writeHead(200);
    res.write(`<style>${style}</style>`);
    res.write(page);
    res.write(`<script>${script}</script>`);
    res.end();
});

//router.all('/', (req, res) => res.send('Hi there!'));


module.exports = router;