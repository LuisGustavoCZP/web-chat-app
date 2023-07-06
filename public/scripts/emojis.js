import WindowModal from './modal.js';
import messager from "./messager.js";

const categories = [];
const emojis = {};

class WindowEmoji extends WindowModal
{
    #category;
    emojiList;
    onemoji;
    constructor ()
    {
        super();
        if(this.hasAttribute("category"))
        {
            this.#category = this.getAttribute("category");
        }
        else this.#category = categories[0];
        const nav = document.createElement("nav");
        categories.forEach(category => 
        {
            const catButton = document.createElement("button");
            catButton.innerText = emojis[category][0].emoji;
            catButton.value = category;
            catButton.title = category;
            catButton.onclick = (e) => this.category = e.target.value;
            nav.appendChild(catButton);
        });
        this.content.appendChild(nav);

        const display = document.createElement("div");
        this.emojiList = document.createElement("ul");
        this.category = this.#category;
        display.appendChild(this.emojiList);
        this.content.appendChild(display);
    }

    get category ()
    {
        return this.#category;
    }

    set category (newcategory)
    {
        this.#category = newcategory;
        this.emojiList.innerHTML = '';
        const catEmojis = emojis[newcategory];
        //console.log(newcategory, emojis);
        catEmojis.forEach(element => 
        {
            const emoji = document.createElement("li");
            const button = document.createElement("button");
            button.innerText = element.emoji;
            button.value = element.emoji;
            button.title = element.description;
            button.onclick = (e) => this.#emojiClick(e);
            emoji.appendChild(button);
            this.emojiList.appendChild(emoji);
        });
    }

    #emojiClick (e)
    {
        e.preventDefault();
        if(this.onemoji) 
        {
            this.onemoji(e.target.value);
        }
    }
}

customElements.define("window-emoji", WindowEmoji);

async function createEmojiWindow (group)
{
    const emojisResp = await fetch(`/emojis/${group?group:''}`).then(resp => resp.json()); 
    
    Object.entries(emojisResp).forEach(emojisCat => {
        const catname = emojisCat[0];
        categories.push(catname);
        emojis[catname] = emojisCat[1];
    });

    const windowEmoji = document.createElement("window-emoji");
    windowEmoji.width = 440;
    windowEmoji.height = 300;
    windowEmoji.build("bottom");
    windowEmoji.classList.add("emojis");
    return windowEmoji;
}

const emojiButton = document.getElementById("messager-emoji");
async function getEmojiWindow ()
{
    const windowEmoji = await createEmojiWindow();

    windowEmoji.style.left += `${emojiButton.clientWidth}px`;
    windowEmoji.style.bottom += `${emojiButton.clientHeight}px`;

    function openEmojiWindow (e)
    {
        e.preventDefault();
        emojiButton.onclick = undefined;
        windowEmoji.onemoji = clickEmoji;
        windowEmoji.onclose = closeEmojiWindow;
        emojiButton.appendChild(windowEmoji);
    }

    function closeEmojiWindow (e)
    {
        emojiButton.onclick = openEmojiWindow;
        windowEmoji.onemoji = undefined;
        windowEmoji.onclose = undefined;
        windowEmoji.remove();
    }

    function clickEmoji (emoji)
    {
        messager.write(emoji);
        closeEmojiWindow();
    }

    emojiButton.onclick = openEmojiWindow;

    return windowEmoji;
}

export default await getEmojiWindow ();