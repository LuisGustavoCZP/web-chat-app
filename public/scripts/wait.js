async function waitTime (ms)
{
    return await new Promise((resolve, reject) => {setTimeout(resolve, ms);})
}

export {waitTime};