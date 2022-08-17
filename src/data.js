const {v4:uuid} = require('uuid');

const msgs = {
    type: "chat",
    data: [],
};

const users = {};
const usersConnection = {};
const sessions = {};

function addMsg (msg)
{
    msgs.data.push(msg);
}

function sendTo (userid, info)
{
    const connection = usersConnection[userid];
    const infoString = JSON.stringify(info);
    if(connection)
    {
        connection.send(infoString);
    }
}

function msgsTo (userid)
{
    sendTo(userid, msgs);
}

function broadcast (info)
{
    const connectionlist = Object.values(usersConnection);
    const infoString = JSON.stringify(info);
    connectionlist.forEach(connection => 
    {
        connection.send(infoString);
    });
}

function broadcastMsgs ()
{
    broadcast(msgs);
}

function broadcastLog (log)
{
    const logmsg = {
        type: "log",
        data: log,
        id:   "system",
        date: Date.now()
    };
    broadcast(logmsg);
}

function broadcastUsers ()
{
    const usermsg = {
        type: "userlist",
        data: Object.values(users),
    };
    broadcast(usermsg);
}

function addUser (username)
{
    const userid = uuid();
    users[userid] = username;
    return userid;
}

function addConnection (userid, connection)
{
    usersConnection[userid] = connection;
    return userid;
}

function removeConnection (userid)
{
    delete usersConnection[userid];
}

function removeUser (user)
{
    delete users[user.id];
    delete usersConnection[user.id];
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
    removeSession,
    addConnection,
    removeConnection,
    broadcastUsers,
    broadcastLog,
    msgsTo
}