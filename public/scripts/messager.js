import {inputManager} from './input.js';
import createSocket from "./socket.js";
import usersWindow from "./users.js";
import logs from "./logs.js";
import {audioRecorder, AudioControl} from "./audio.js"

function ortoDigits (num)
{
    return (num).toLocaleString('pt-BR', {minimumIntegerDigits: 2, useGrouping:false});
}

/**
 * 
 * @param {Blob} blob 
 * @returns {Promise<text>}
 */
async function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
}

function b64toBlob(dataURI) {
    
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return [ab];
}

function createMessager ()
{
    const messages = document.getElementById("messages");
    const messagesList = document.getElementById("messages-list");

    const messager = document.getElementById("messager");
    const messagerInput = document.getElementById("messager-text");
    const messagerSubmit = document.getElementById("messager-submit");

    const audioButton = document.getElementById("messager-audio");

    /**
     * @type {string}
     */
    let clientID;

    let appSocket = createSocket(enable, disable, receiveMessages, focus);
    audioRecorder.ondisable = () => blockAudio();
    /**
     * @type {Map<string, string>}
     */
    const usersColors = new Map();

    function start ()
    {
        appSocket.start();
    }

    function blockAudio ()
    {
        audioButton.classList.add("disabled");
        audioRecorder.onclose = undefined;
        audioButton.onpointerdown = undefined;
        audioButton.onpointerup = undefined;
    }

    function enable ()
    {
        messages.classList.remove("hidden");
        messager.classList.remove("hidden");

        messagerInput.addEventListener('keydown', inputMessage);
        messagerSubmit.addEventListener("click", sendMessage);

        audioRecorder.onclose = (audio) => sendAudio(audio);
        audioButton.onpointerdown = () => audioRecorder.start();
        audioButton.onpointerup = () => audioRecorder.stop();
    }

    function disable ()
    {
        messages.classList.add("hidden");
        messager.classList.add("hidden");

        messagerInput.removeEventListener('keydown', inputMessage);
        messagerSubmit.removeEventListener("click", sendMessage);
    }

    function textMessage (text)
    {
        const p = document.createElement("p");
        p.innerText = text;
        return p;
    }

    function audioMessage (audio64)
    {
        const audio = document.createElement("audio-control");
        audio.build (new Audio(audio64));
        return audio;
    }

    const messageTypes = {
        "message": textMessage,
        "audio": audioMessage
    }

    function createMessage (type, msg)
    {
        const div = document.createElement("div");
        div.style = `background-color:${usersColors.get(msg.id)}`;

        if(type === 0)
        {
            const title = document.createElement("h4");
            title.innerText = msg.username;
            title.style = `background-color:${usersColors.get(msg.id)}`;
            div.appendChild(title);
        }

        console.log(msg)
        const msgElement = messageTypes[msg.type](msg.data);
        div.appendChild(msgElement);

        if(type === 0 || type === 1)
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
        "message-received",
        "message-send"
    ];

    function messageClass (msgid)
    {
        if(msgid === clientID) return 1;
        else return 0;
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
            const type = messageClass(msg.id);
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
            data: text,
            date: Date.now()
        };

        appSocket.send(msg);
    }

    /**
     * 
     * @param {Blob} audio 
     */
    async function sendAudio (audio)
    {
        const txt = await blobToBase64(audio)
        if(txt == "data:") return;
        try
        {
            const test = new Audio (txt);
            console.log(txt);
            const msg = {
                type: "audio",
                data: txt,
                date: Date.now()
            };
            appSocket.send(msg);
        }
        catch (e)
        {
            console.log(e);
        }
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