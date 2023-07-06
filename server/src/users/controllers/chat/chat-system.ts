import WebSocket from "ws";
import { SocketServer, app, settings } from "../../../base";
import type {IWebData, Socket, SocketData} from "../../../base";
import { UserSession } from "../../models";
import { SocketMessage } from "./interfaces";
import { ChatSession } from "./chat-session";


export class ChatSystem
{
    
    socketServer: SocketServer;
    sessions: Map<string, ChatSession[]>;
    users: Map<string, string>;

    constructor (socketServer : SocketServer)
    {
        this.socketServer = socketServer;
        
        this.sessions = new Map<string, ChatSession[]> ();
        this.users = new Map<string, string> ();

        socketServer.addTrigger("message", (ws: Socket, data?: IWebData) => this.userMessage(ws, data));
        //socketServer.addTrigger("connected", (ws: Socket, data?: IWebData) => this.userConnect(ws, data));
        //socketServer.addTrigger("disconnected", (ws: Socket, data?: IWebData) => this.userDisconnect(ws, data));
    }

    async userConnect(ws: Socket, socketData?: IWebData)
    {
        console.log("\nUsuario conectado!");
    }

    async userDisconnect(ws: Socket, socketData?: IWebData)
    {
        console.log("\nUsuario desconectado!");
    }

    async userMessage(ws: Socket, socketData?: IWebData)
    {
        if(!socketData) return;
        
        if(socketData.type === "session") 
        {
            const id = socketData.data?.userid;
            if(!id) return;

            const session = await this.createSession(ws, id);
            console.log(`\nUsuario conectado!\nID: ${id}\nSession: ${session.id}\nTime:${new Date()}\n`);

            session.addTrigger("text", (session: ChatSession, socketData?: IWebData) => this.userText(session, socketData));
            session.addTrigger("closed", (session: ChatSession, socketData?: IWebData) => this.removeSession(session));

            await session.start ();
        }
    }

    async userText(session: ChatSession, socketData?: IWebData)
    {
        if(!socketData) return;
        socketData.data.owner = session.userid;
        const target = socketData.data.target;
        /* delete socketData.data.target; */

        session.send(socketData);
        this.send(target, socketData);
    }

    async send (userid: string, socketData?: IWebData)
    {
        //console.log("Sending", socketData);

        const sessions = this.sessions.get(userid);
        if(!sessions) return;

        sessions?.forEach((session) => 
        {
            session.send(socketData);
        });
    }

    async broadcast (socketData?: IWebData, except?: string[])
    {
        //console.log("broadcast", socketData);

        this.sessions.forEach((sessions, key) => 
        {
            if(!except?.includes(key))
            {
                sessions?.forEach((session) => 
                {
                    session.send(socketData);
                });
            }
        });
    }

    async createSession (ws: Socket, userid : string)
    {
        const session = new ChatSession(ws, userid);

        if(!this.sessions.has(userid))
        {
            this.sessions.set(userid, [session]);
            this.broadcast({type:"online-user", time:new Date(), data:{userid}}, [userid]);
        }
        else 
        {
            const sessions = this.sessions.get(userid)!;
            sessions.push(session);
            //console.log("Extra connection", sessions);
        }

        this.users.set(session.id, userid);

        const userList = Array.from(this.sessions.keys());
        //console.log("Sending Userlist", userList);

        this.send(userid, {type:"online-users", time:new Date(), data:{users:userList}});
        
        return session;
    }

    async removeSession (session : ChatSession)
    {
        const userid = this.users.get(session.id);
        if(!userid) return;

        this.users.delete(session.id);

        if(this.sessions.has(userid))
        {
            const sessions = this.sessions.get(userid);
            if(!sessions) return;
            const sindex = sessions.findIndex(session => session.id = session.id);
            if(sindex < 0) return;
            sessions.splice(sindex, 1);
            
            if(!sessions.length) 
            {
                this.sessions.delete(userid);
                this.broadcast({type:"offline-user", time:new Date(), data:{userid:userid}});
            }
        }

        console.log(`\nUsuario desconectado!\nID: ${userid}\nSession: ${session.id}\nTime:${new Date()}\n`);
    }
}

export const chatSystem = new ChatSystem(app.socketServer);

/* 
const users = new Map<string, UserSession>();
const sessions = new Map<string, {userid : string}>();

function addUser (username : string)
{
    const userid = settings.uuid();
    users.set(userid, new UserSession(userid, username, true));
    return userid;
}

function removeUser (user : UserSession)
{
    user.connections.forEach(connection =>
    {
        connection.close();
    });
    users.delete(user.id);
}

function addSession (userid : string)
{
    const sessionid = settings.uuid();
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
} */