import { waitUntil } from "./wait.js";

class AudioRecorder
{
    #ondisable;
    /**
     * @type {MediaStream}
     */
    #stream;
    /**
     * @type {MediaRecorder}
     */
    #mediaRecorder;
    /**
     * @type {Blob}
     */
    #audioBlob;
    /**
     * @type {(audio : Blob) => void}
     */
    #onclose;

    constructor ()
    {
        this.#stream = undefined;
        this.#mediaRecorder = undefined;
        this.#audioBlob = undefined;
        this.initiate();
        this.#ondisable = undefined;
    }

    async initiate ()
    {
       this.#stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => { if(this.#ondisable) this.#ondisable(); });
       this.#stream.getTracks().forEach(track => track.stop());
    }
    
    async start ()
    {
        this.#stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => { if(this.#ondisable) this.#ondisable(); });
        this.#mediaRecorder = new MediaRecorder(this.#stream);
        this.#mediaRecorder.start();

        const audioChunks = [];
        this.#mediaRecorder.addEventListener("dataavailable", event => 
        {
            audioChunks.push(event.data);
        });

        this.#mediaRecorder.addEventListener("stop", () => 
        {
            this.#audioBlob = new Blob(audioChunks, { 'type' : 'audio/ogg; codecs=opus' });
            this.#mediaRecorder = undefined;
        });

        setTimeout(() => 
        {
            this.stop ();
        }, 10000);
    }

    async stop ()
    {
        const mediaRecorder = this.#mediaRecorder;
        if(!mediaRecorder || mediaRecorder.state == "inactive") return;
        mediaRecorder.stop();
        await waitUntil(() => this.#audioBlob != undefined);
        const audio = this.#audioBlob;
        if(this.#onclose) this.#onclose(audio);
        this.#audioBlob = undefined;
        this.#stream.getTracks().forEach(track => track.stop());
    }

    /**
     * @param {(audio : Blob)=>{}} callback
     */
    set onclose (callback)
    {
        this.#onclose = callback;
    }

    /**
     * @param {()=>void} callback
     */
    set ondisable (callback)
    {
        this.#ondisable = callback;
    }
}

class AudioControl extends HTMLElement
{
    /**
     * @type {HTMLAudioElement}
     */
    #player;
    #playing;
    #playButton;
    #trackRange;

    constructor()
    {
        super();
        this.#player = undefined;
        this.#playing = false;

        this.#playButton = document.createElement("button");
        this.#playButton.classList.add("play-button");
        this.#playButton.classList.add("material-symbols-rounded");
        
        this.#playButton.onclick = () => 
        {
            this.playing = this.#player.paused;
        };
 
        this.#trackRange = document.createElement("input");
        this.#trackRange.type = 'range';
        this.#trackRange.min = 0;
        this.#trackRange.max = 100;
        this.#trackRange.step = 0.1;
        this.#trackRange.value = 0;
    }

    /**
     * @param {HTMLAudioElement} audio
     */
    build (audio)
    {
        if(audio) this.player = audio;
        this.appendChild(this.#playButton);
        this.appendChild(this.#trackRange);

        this.setAttribute("src", audio.src)
    }

    set playing (value)
    {
        this.#playing = value;
        this.#playButton.innerText = !value ? "play_circle" : "pause_circle";
        if(value) this.#player.play();
        else this.#player.pause();
    }

    /**
     * @param {HTMLAudioElement} audio
     */
    set player (audio)
    {
        this.#player = audio;
        audio.onended = () => {this.playing = false};

        audio.ontimeupdate = (t) => 
        {
            const per = (audio.currentTime / audio.duration)*100;
            this.#trackRange.value = per;
        };

        this.#trackRange.onpointerdown = (e) => {
            if(this.#playing) this.#player.pause();
        }

        this.#trackRange.onpointerup = (e) => {
            if(this.#playing) this.#player.play();
        }

        this.#trackRange.onchange = (e) => 
        {
            const per = (Number(this.#trackRange.value) * audio.duration)/100;
            audio.currentTime = per;
        }

        this.playing = false;
    }

    get player ()
    {
        return this.#player;
    }
}
customElements.define("audio-control", AudioControl);

const audioRecorder = new AudioRecorder();


export {audioRecorder, AudioControl};