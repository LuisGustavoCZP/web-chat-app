const data = require('../data');

function loginRoute (req, res) 
{
    const {username} = req.query;
    console.log(username);
    const userid = data.addUser({username});
    const sessionid = data.addSession(userid);
    res.redirect(`/home/${sessionid}`);
}

module.exports = { loginRoute };