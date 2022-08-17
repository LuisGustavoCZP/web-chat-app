/**
 * 
 * @param {Event} e 
 * @param {HTMLElement} inputer 
 * @param {HTMLElement} submiter 
 * @param {()=>{}} enableCallback 
 * @param {()=>{}} disableCallback 
 * @returns 
 */
export function inputManager (e, inputer, submiter, enableCallback, disableCallback)
{
    var key = e.which || e.keyCode;
    /**
     * @type {string}
     */
    const text = inputer.value;
    if(key == 8)
    {
        if((text.length <= 1 || /^\p{Extended_Pictographic}$/ugm.test(text)) && !submiter.classList.contains("disabled"))
        {
            submiter.classList.add("disabled");
            if(disableCallback) disableCallback();
        }
        return;
    }

    const isSend = key == 13 && !e.shiftKey;
    if(!isSend && (key < 48 || key > 90)) return;

    //const matchs = text.match(/\w*/gi);
    //console.log(matchs);
    if(text.trim().length >= 0)
    {
        submiter.classList.remove("disabled");
        if (isSend)
        {
            e.preventDefault();
            if(enableCallback) enableCallback();
        }
    }
}