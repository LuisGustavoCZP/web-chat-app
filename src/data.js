const {v4:uuid} = require('uuid');

/* const msgs = {
    type: "chat",
    data: [],
}; */

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

function connect (userid, connection)
{
    const user = users[userid];
    if(!user) return;

    usersConnection[userid] = connection;
    user.online = true;

    broadcastLog(`${user.name} entrou`);
    broadcastUsers();
    //msgsTo(userid);
    return userid;
}

function disconnect (userid)
{
    delete usersConnection[userid];
    
    const user = users[userid];
    if(!user) return;
    user.online = false;

    broadcastLog(`${user.name} saiu`);
    broadcastUsers();
}

function addUser (username)
{
    const userid = uuid();
    users[userid] = {id:userid, name:username, online:true};
    return userid;
}

function removeUser (user)
{
    delete usersConnection[user.id];
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
    /* msgs, */
    users, 
    sessions,
    /* addMsg, */
    /* broadcastMsgs, */
    addUser,
    removeUser,
    addSession,
    removeSession,
    connect,
    disconnect,
    broadcastUsers,
    broadcastLog,
    broadcast,
    /* msgsTo, */
    sendTo
}