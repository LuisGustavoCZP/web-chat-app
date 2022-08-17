import {inputManager} from './input.js';
import createSocket from "./socket.js";
import usersWindow from "./users.js";
import logs from "./logs.js";

function ortoDigits (num)
{
    return (num).toLocaleString('pt-BR', {minimumIntegerDigits: 2, useGrouping:false});
}

function createMessager ()
{
    const messages = document.getElementById("messages");
    const messagesList = document.getElementById("messages-list");

    const messager = document.getElementById("messager");
    const messagerInput = document.getElementById("messager-text");
    const messagerSubmit = document.getElementById("messager-submit");

    /**
     * @type {string}
     */
    let clientID;

    let appSocket = createSocket(enable, disable, receiveMessages, focus);

    /**
     * @type {Map<string, string>}
     */
    const usersColors = new Map();
    usersColors.set('system', `unset`);

    function start ()
    {
        appSocket.start();
    }

    function enable ()
    {
        messages.classList.remove("hidden");
        messager.classList.remove("hidden");

        messagerInput.addEventListener('keydown', inputMessage);
        messagerSubmit.addEventListener("click", sendMessage);
    }

    function disable ()
    {
        messages.classList.add("hidden");
        messager.classList.add("hidden");

        messagerInput.removeEventListener('keydown', inputMessage);
        messagerSubmit.removeEventListener("click", sendMessage);
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
            time.innerText = `${ortoDigits(msgDate.getHours())}:${ortoDigits(msgDate.getMinutes())}`;
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

    function receiveSetup (data)
    {
        clientID = data;
        usersColors.set(clientID, `hsla(360, 100%, 100%, .5)`);
    }

    function receiveChat (data)
    {
        //console.log(data);
        renderMessages(data);
    }

    function receiveLog (data)
    {
        console.log(data);
        logs.update(data);
    }

    function receiveUserlist (data)
    {
        console.log(data);
        usersWindow.update(data);
    }

    const events = {
        "setup": receiveSetup,
        "chat": receiveChat,
        "log": receiveLog,
        "userlist": receiveUserlist,
    };

    function receiveMessages(response)
    {
        const responseData = JSON.parse(response.data);
        const event = events[responseData.type];

        if(event) 
        {
            event(responseData.data);
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

        appSocket.send(msg);
    }

    function inputMessage(e)
    {
        inputManager(e, messagerInput, messagerSubmit, sendMessage);
    }

    function focus ()
    {
        messagerInput.focus();
    }

    function write (text)
    {
        //console.log("escrevendo: ", text);
        messagerInput.value += text;
        messagerSubmit.classList.remove("disabled");
    }

    return {
        start,
        enable,
        disable,
        write
    }
}

export default createMessager ();