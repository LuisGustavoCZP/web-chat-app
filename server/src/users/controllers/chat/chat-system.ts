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
        socketServer.addTrigger("connected", (ws: Socket, data?: IWebData) => this.userConnect(ws, data));
        socketServer.addTrigger("disconnected", (ws: Socket, data?: IWebData) => this.userDisconnect(ws, data));
    }

    async userConnect(ws: Socket, socketData?: IWebData)
    {
        console.log("Usuario conectado!");
    }

    async userDisconnect(ws: Socket, socketData?: IWebData)
    {
        console.log("Usuario desconectado!");
    }

    async userMessage(ws: Socket, socketData?: IWebData)
    {
        if(!socketData) return;
        console.log("Receive", socketData);
        
        if(socketData.type === "session") 
        {
            console.log("Recebeu sessão");
            const id = socketData.data?.userid;
            console.log("ID", id)
            if(!id) return;

            const session = await this.createSession(ws, id);
            
            session.addTrigger("text", (session: ChatSession, socketData?: IWebData) => this.userText(session, socketData));
            
            await session.start ();
        }
    }

    async userText(session: ChatSession, socketData?: IWebData)
    {
        console.log("Receive Text", socketData);

        if(!socketData) return;
        socketData.data.owner = session.userid;
        const target = socketData.data.target;
        /* delete socketData.data.target; */

        session.send(socketData);
        this.send(target, socketData);
    }

    async send (userid: string, socketData?: IWebData)
    {
        const sessions = this.sessions.get(userid);
        if(!sessions) return;

        /* const sessions = this.sessions.get(id);
        if(!sessions) return; */

        sessions?.map((session) => 
        {
            session.send(socketData);
        });
    }

    async createSession (ws: Socket, userid : string)
    {
        const session = new ChatSession(ws, userid);
        if(!this.sessions.has(userid))
        {
            this.sessions.set(userid, [session]);
        }
        else this.sessions.get(userid)?.push(session);
        this.users.set(session.id, userid);
        return session;
    }

    async removeSession (sessionid : string)
    {
        const userid = this.users.get(sessionid);
        if(!userid) return;

        this.users.delete(sessionid);

        if(this.sessions.has(userid))
        {
            const sessions = this.sessions.get(userid);
            if(!sessions) return;
            const sindex = sessions.findIndex(session => session.id = sessionid);
            if(sindex < 0) return;
            sessions.splice(sindex, 1);
            if(sessions?.length) this.sessions.delete(userid)
        }
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