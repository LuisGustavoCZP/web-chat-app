const { WebSocket } = require('ws');
const data = require('./data');

function socket (server)
{
    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', ws => 
    {
        

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

        function receiveSession (resp)
        {
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
            if(data["id"]) delete data["id"];
            data.id = userid;
            data.username = users[data.id].username;
            addMsg(data);
            broadcastMsgs();
        };

        const events = {
            "message": receiveMessage,
            "session": receiveSession,
            "username": receiveUsername
        }

        ws.on('message', resp => 
        {
            const msg = JSON.parse(resp.toString());
            events[msg.type] (msg);
        });

        ws.on('close', () => {
            const user = users[userid];
            if(user) {
                const msg = {
                    type: "message",
                    text: `${user.username} saiu`,
                    id:   "system",
                    date: Date.now()
                };
                addMsg(msg);
                broadcastMsgs();
                removeUser(user);
            }
            console.log(`Client disconnected with id:${userid}.`);
        });
    });
}

module.exports = socket;