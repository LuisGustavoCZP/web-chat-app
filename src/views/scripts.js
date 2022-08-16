const fs = require('fs');
const inputScript = fs.readFileSync('./public/input.js');
//const indexScript = fs.readFileSync('./public/index.js');
//const loginScript = fs.readFileSync('./public/login.js');

function sendInputScript (req, res) 
{
    res.set('Content-Type', 'text/javascript');
    res.write(inputScript);
    res.end();
}

function sendIndexScript (req, res)
{
    const indexScript = fs.readFileSync('./public/index.js');
    res.set('Content-Type', 'text/javascript');
    res.write(indexScript);
    res.end();
}

function sendLoginScript (req, res)
{
    const loginScript = fs.readFileSync('./public/login.js');
    res.set('Content-Type', 'text/javascript');
    res.write(loginScript);
    res.end();
}

module.exports = {
    sendInputScript,
    sendIndexScript,
    sendLoginScript
}