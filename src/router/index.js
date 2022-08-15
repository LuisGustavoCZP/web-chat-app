const express = require('express');
const fs = require('fs');

const style = fs.readFileSync('./public/style.css');
const page = fs.readFileSync('./public/index.html');
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
    //const page = fs.readFileSync('./public/index.html');
    res.write(style);
    res.write(page);
    res.end();
});

//router.all('/', (req, res) => res.send('Hi there!'));


module.exports = router;