const fs = require('fs');
const logo = fs.readFileSync('./public/images/logo.png');

function sendLogoIcon (req, res)
{
    res.send(logo);
}

module.exports = { sendLogoIcon }