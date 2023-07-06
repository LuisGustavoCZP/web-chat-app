interface SocketMessage 
{
    type:   string,//"log" | "userlist" | "setup" | "private" | "message" | "session",
    data:   any,
    time:   Date
}

export { SocketMessage }