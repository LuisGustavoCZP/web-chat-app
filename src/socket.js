const { WebSocket } = require('ws');
const {v4:uuid} = require('uuid');
//h
const msgs = {
    type: "chat",
    data: [],
};
const users = {};

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

function addUser (userid, data)
{
    users[userid] = data;
}

function removeUser (userid)
{
    delete users[userid];
}

function socket (server)
{
    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', ws => {
        const userid = uuid();

        console.log(`Client connected with id:${userid}.`);
    
        function receiveUsername (resp)
        {
            //console.log(resp);
            const initialSetup = {
                type: "setup",
                data: userid
            };
            ws.send(JSON.stringify(initialSetup));

            addUser(userid, {socket:ws, username:resp.text});
            const msg = {
                type: "message",
                text: `${resp.text} entrou`,
                id:   "system",
                date: Date.now()
            };
            addMsg(msg);
            broadcastMsgs();
        };

        function receiveMessage (data)
        {
            data.username = users[data.id].username;
            addMsg(data);
            broadcastMsgs();
        };

        const events = {
            "message": receiveMessage,
            "setuser": receiveUsername
        }

        ws.on('message', resp => 
        {
            const msg = JSON.parse(resp.toString());
            events[msg.type] (msg);
        });

        ws.on('close', () => {
            const msg = {
                type: "message",
                text: `${users[userid].username} saiu`,
                id:   "system",
                date: Date.now()
            };
            addMsg(msg);
            broadcastMsgs();
            removeUser(userid);
            console.log(`Client disconnected with id:${userid}.`);
        });
    });
}

module.exports = socket;