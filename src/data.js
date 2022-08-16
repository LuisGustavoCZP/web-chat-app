const {v4:uuid} = require('uuid');

const msgs = {
    type: "chat",
    data: [],
};
const users = {};
const sessions = {};

function addMsg (msg)
{
    msgs.data.push(msg);
}

function broadcastMsgs ()
{
    const msgsString = JSON.stringify(msgs);
    const userslist = Object.values(users);
    //console.log(userslist.length);
    userslist.forEach(user => 
    {
        user.socket.send(msgsString);
    });
}

function addUser (data)
{
    const userid = uuid();
    users[userid] = data;
    return userid;
}

function removeUser (user)
{
    delete users[user.id];
}

function addSession (userid)
{
    const sessionid = uuid();
    sessions[sessionid] = { userid };
    return sessionid;
}

function removeSession (sessionid)
{
    delete sessions[sessionid];
}

module.exports = {
    msgs,
    users, 
    sessions,
    addMsg,
    broadcastMsgs,
    addUser,
    removeUser,
    addSession,
    removeSession
}