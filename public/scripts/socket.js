function createSocket (onStart, onStop, onMessage, onOpened)
{
    /**
     * @type {WebSocket}
     */
    let socket;

    const sessionid = location.pathname.replace(/\/\w*\//gi, '');
    console.log(sessionid);
    
    function start ()
    {
        socket = new WebSocket(`wss://${window.location.host}`, "https", "http");
        socket.onopen = socketOpened;
        socket.onclose = socketClosed;
    }

    function stop ()
    {
        socket.onopen = undefined;
        socket.onclose = undefined;
        socket.close();
    }

    function socketOpened (event)
    {
        console.log("abriu servidor");
        if(onStart) onStart();

        socket.onmessage = onMessage;

        const msgUser = {
            type: "session",
            id: sessionid,
            date: Date.now()
        };
        socket.send(JSON.stringify(msgUser));

        if(onOpened) onOpened();
    }

    function socketClosed (event)
    {
        console.log("fechou servidor", event.reason);
        if(onStop) onStop();

        if(event.code === 1002 && event.reason === "A sessão não é mais válida")
        {
            location.assign('/');
        }

        socket.onmessage = undefined;
    }

    function send (data)
    {
        socket.send(JSON.stringify(data));
    }

    return {
        start,
        stop,
        send
    }
}

export default createSocket;