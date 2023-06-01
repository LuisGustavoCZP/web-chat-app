import { uuid } from "../settings";
import { User } from "../models";
import { SocketMessage } from "./models";
import { SocketClient } from "./socket-client";

const users = new Map<string, User>();
const sessions = new Map<string, {userid : string}>();

function addUser (username : string)
{
    const userid = uuid();
    users.set(userid, new User(userid, username, true));
    return userid;
}

function removeUser (user : User)
{
    user.connections.forEach(connection => 
    {
        connection.close(); 
    });
    users.delete(user.id);
}

function addSession (userid : string)
{
    const sessionid = uuid();
    sessions.set(sessionid, { userid });
    return sessionid;
}

function removeSession (sessionid : string)
{
    sessions.delete(sessionid);
}

function connect (userid : string, connection : SocketClient)
{
    const user = users.get(userid);
    if(!user) return;

    user.online = true;

    connection.userid = userid;
    user.connections.push(connection);

    if(user.connections.length == 1)
    {
        broadcastLog(`${user.name} entrou`);
        broadcastUsers();
    }

    return userid;
}

function disconnect (userid : string, connectionId : string)
{
    const user = users.get(userid);
    if(!user) return;

    const connectionIndex = user.connections.findIndex((connection) => connection.id == connectionId)
    
    if(connectionIndex)
    {
        user.connections.splice(connectionIndex, 1);
    }
    
    if(user.connections.length == 0) 
    {
        user.online = false;

        broadcastLog(`${user.name} saiu`);
        broadcastUsers();
    }
}

function sendTo (userid : string, info : SocketMessage)
{
    const user = users.get(userid);
    if(!user) return;
    
    user.connections.forEach(connection => 
    {
        connection.send(info);
    });
}

function broadcast (info : SocketMessage)
{
    const userList = Array.from(users.values());
    const infoString = info;
    
    userList.forEach(user => 
    {
        user.connections.forEach(connection => 
        {
            connection.send(infoString);
        });
    });
}

function broadcastLog (log : any)
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
        data: Array.from(users.values()),
        id:   "system",
        date: Date.now()
    };
    broadcast(usermsg);
}

export {
    users, 
    sessions,
    addUser,
    removeUser,
    addSession,
    removeSession,
    connect,
    disconnect,
    sendTo,
    broadcast,
    broadcastLog,
    broadcastUsers,
}