const fs = require('fs');
//const style = fs.readFileSync('./public/style.css');

function sendGlobalStyle (req, res)
{
    const style = fs.readFileSync('./public/style.css');
    res.set('Content-Type', 'text/css');
    res.write(style);
    res.end();
}

module.exports = {sendGlobalStyle};