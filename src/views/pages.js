const fs = require('fs');
//const homePage = fs.readFileSync('./public/index.html');
//const loginPage = fs.readFileSync('./public/login.html');

function sendLoginPage (req, res) 
{
    const loginPage = fs.readFileSync('./public/login.html');

    res.writeHead(200);
    res.write(loginPage);
    res.end();
}

function sendHomePage (req, res) 
{
    const homePage = fs.readFileSync('./public/index.html');

    res.writeHead(200);
    res.write(homePage);
    res.end();
}

module.exports = { sendLoginPage, sendHomePage }