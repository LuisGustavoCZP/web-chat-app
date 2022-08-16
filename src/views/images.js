const fs = require('fs');
const logo = fs.readFileSync('./public/logo.png');

function sendLogoIcon (req, res)
{
    res.send(logo);
}

module.exports = { sendLogoIcon }