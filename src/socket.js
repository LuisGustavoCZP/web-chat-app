const { WebSocket } = require('ws');
const {v4:uuid} = require('uuid');

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
    console.log(userslist.length);
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
            console.log(resp);
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
            addMsg(data);
            broadcastMsgs();
        };

        ws.on('message', resp => 
        {
            const msg = JSON.parse(resp.toString());
            switch (msg.type) {
                case "message":
                    receiveMessage(msg);
                    break;
                case "setuser":
                    receiveUsername(msg);
                    break;
                default:
                    break;
            }
        });

        ws.on('close', () => {
            removeUser(userid);
        });
    });
}

module.exports = socket;