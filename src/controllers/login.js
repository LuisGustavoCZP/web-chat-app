const data = require('../data');
const { usernameValidator } = require('../validators');

function loginRoute (req, res) 
{
    const {username} = req.query;

    let validUsername = usernameValidator(username);
    if(!validUsername) 
    {   
        res.redirect(`/`);
        return;
    }
    console.log(validUsername);
    const userid = data.addUser(validUsername);
    const sessionid = data.addSession(userid);
    res.redirect(`/home/${sessionid}`);
}

module.exports = { loginRoute };