import messager from "./messager.js";

const emojiButton = document.getElementById("messager-emoji");
const fileButton = document.getElementById("messager-file");
const audioButton = document.getElementById("messager-audio");

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

emojiButton.onclick = () => 
{

}

messager.start();