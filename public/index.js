import {inputManager} from './input.js';
const sessionid = location.pathname.replace(/\/\w*\//gi, '');
console.log(sessionid);

const messages = document.getElementById("messages");
const messagesList = document.getElementById("messages-list");

const messager = document.getElementById("messager");
const messagerInput = document.getElementById("messager-text");
const messagerSubmit = document.getElementById("messager-submit");
let clientID;

const usersColors = new Map();
usersColors.set('system', `unset`); //hsla(360, 0%, 50%, .25)
let chatSocket;

function startChat ()
{
    chatSocket = new WebSocket(`wss://${window.location.host}`, "https", "http");

    chatSocket.onopen = socketOpened;
    chatSocket.onclose = socketClosed;
}

function socketOpened (event)
{
    console.log("abriu servidor");
    messages.classList.remove("hidden");
    messager.classList.remove("hidden");

    messagerInput.addEventListener('keydown', inputMessage);
    messagerSubmit.addEventListener("click", sendMessage);

    chatSocket.onmessage = receiveMessages;

    const msgUser = {
        type: "session",
        id: sessionid,
        date: Date.now()
    };
    chatSocket.send(JSON.stringify(msgUser));

    messagerInput.focus();
}

function socketClosed (event)
{
    console.log("fechou servidor", event);
    if(event.code === 1002 && event.reason === "A sessão não é mais válida")
    {
        location.assign('/');
    }

    messages.classList.add("hidden");
    messager.classList.add("hidden");

    messagerInput.removeEventListener('keydown', inputMessage);
    messagerSubmit.removeEventListener("click", sendMessage);

    chatSocket.onmessage = undefined;
}

function createMessage (type, msg)
{
    const div = document.createElement("div");
    div.style = `background-color:${usersColors.get(msg.id)}`;

    if(type === 2)
    {
        const title = document.createElement("h4");
        title.innerText = msg.username;
        title.style = `background-color:${usersColors.get(msg.id)}`;
        div.appendChild(title);
    }

    const p = document.createElement("p");
    p.innerText = msg.text;
    div.appendChild(p);

    if(type === 2 || type === 1)
    {
        const time = document.createElement("h6");
        const msgDate = new Date(msg.date);
        console.log(msgDate);
        time.innerText = `${msgDate.getHours()}:${msgDate.getMinutes()}`;
        div.appendChild(time);
    }

    return div;
}

const messageClasses = [
    "message-system",
    "message-send",
    "message-received"
];

function messageType (msgid)
{
    if(msgid === "system") return 0;
    else if(msgid === clientID) return 1;
    else return 2;
}

function renderMessages(msgs)
{
    messagesList.innerHTML = '';
    msgs.forEach(msg => 
    {
        if(!usersColors.has(msg.id))
        {
            usersColors.set(msg.id, randomColor());
        }

        const li = document.createElement("li");
        const type = messageType(msg.id);
        li.classList.add(messageClasses[type]);
        li.appendChild(createMessage(type, msg));
        messagesList.appendChild(li);
    });

    messages.scrollTo(0, messages.scrollHeight);
}

function randomColor ()
{
    const hue = Math.random()*360;
    return `hsla(${hue}, 100%, 75%, .5)`;
}

function receiveMessages(response)
{
    const responseData = JSON.parse(response.data);
    if (responseData.type == "setup")
    {
        clientID = responseData.data;
        usersColors.set(clientID, `hsla(360, 100%, 100%, .5)`);
    }
    else 
    {
        console.log(responseData.data);
        renderMessages(responseData.data);
    }
}

function sendMessage()
{
    messagerSubmit.classList.add("disabled");
    const text = messagerInput.value;
    messagerInput.value = '';
    if(!text) {
        console.log("Nenhuma mensagem para enviar");
        return;
    }
    console.log("Enviando mensagem");
    const msg = {
        type: "message",
        text: text,
        date: Date.now()
    };
    chatSocket.send(JSON.stringify(msg));
}

function inputMessage(e)
{
    inputManager(e, messagerInput, messagerSubmit, sendMessage);
}

const emojis = {};
async function getEmojis (group)
{
    const emojisResp = await fetch(`/emojis/${group?group:''}`).then(resp => resp.json());
    /* emojisResp.forEach(element => 
    {
        if(element.version >= "13") return;
        if(!emojis[element.category]) emojis[element.category] = [];
        emojis[element.category].push(element);
    }); */
    
    console.log(emojisResp);
}

getEmojis();
startChat();