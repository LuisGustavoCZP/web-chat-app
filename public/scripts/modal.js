class WindowModal extends HTMLElement
{    
    content;
    blocker;
    onclose;
    onclick;

    constructor ()
    {
        super();
        const t = this;

        this.blocker = document.createElement("div");
        this.blocker.className = "blocker";
        this.blocker.onclick = (e) => this.#windowClose(e);

        this.content = document.createElement("div");
        this.content.className = "content";
        this.content.onclick = (e) => this.#windowClick(e);
    }

    build (classname)
    {
        this.appendChild(this.blocker);
        this.className = `modal${classname?` ${classname}`:''}`;
        this.appendChild(this.content);
    }

    /**
     * @param {number} value
     */
    set width (value)
    {
        this.content.style.width = `${value}px`;
    }

    /**
     * @param {number} value
     */
    set height (value)
    {
        this.content.style.height = `${value}px`;
    }

    #windowClose (e)
    {
        e.preventDefault();
        e.stopPropagation();
        if(this.onclose) this.onclose(e);
    }

    #windowClick (e)
    {
        e.preventDefault();
        e.stopPropagation();
        if(this.onclick) this.onclick(e);
    }
}

customElements.define("window-modal", WindowModal);

export default WindowModal;