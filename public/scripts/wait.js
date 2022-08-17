/**
 * 
 * @param {number} ms 
 * @returns 
 */
async function waitTime (ms)
{
    return await new Promise((resolve, reject) => {setTimeout(resolve, ms);})
}

/**
 * 
 * @param {() => boolean} condition 
 * @returns 
 */
async function waitUntil (condition)
{
    return await new Promise((resolve, reject) => 
    {
        function checkCondition ()
        {
            if(!condition()) setTimeout(checkCondition, 500);
            else resolve();
        }

        checkCondition ();
    });
}

export {waitTime, waitUntil};