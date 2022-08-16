const { WebSocket } = require('ws');
const data = require('./data');

function socket (server)
{
    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', ws => 
    {
        let userid = undefined;

        function receiveSession (resp)
        {
            console.log(resp);
            const session = data.sessions[resp.id];
            if(!session) 
            {
                ws.close(1002, "A sessão não é mais válida");//
                return;
            }

            userid = session.userid;
            console.log(`Client connected with id:${userid}.`);

            const initialSetup = {
                type: "setup",
                data: userid
            };
            ws.send(JSON.stringify(initialSetup));

            const user = data.users[userid];
            if(!user) return;

            user.socket = ws;
            
            const msg = {
                type: "message",
                text: `${user.username} entrou`,
                id:   "system",
                date: Date.now()
            };
            data.addMsg(msg);
            data.broadcastMsgs();
        };

        function receiveMessage (msg)
        {
            const user = data.users[userid];
            if(!user) return;
            if(msg["id"]) delete msg["id"];
            msg.id = userid;
            msg.username = user.username;
            data.addMsg(msg);
            data.broadcastMsgs();
        };

        const events = {
            "message": receiveMessage,
            "session": receiveSession
        }

        ws.on('message', resp => 
        {
            const msg = JSON.parse(resp.toString());
            events[msg.type] (msg);
        });

        ws.on('close', () => {
            const user = data.users[userid];
            if(user) {
                const msg = {
                    type: "message",
                    text: `${user.username} saiu`,
                    id:   "system",
                    date: Date.now()
                };
                data.addMsg(msg);
                data.broadcastMsgs();
            }
            console.log(`Client disconnected with id:${userid}.`);
        });
    });
}

module.exports = socket;