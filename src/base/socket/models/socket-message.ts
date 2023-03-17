interface SocketMessage 
{
    type:   string,//"log" | "userlist" | "setup" | "private" | "message" | "session",
    data:   any,
    id:     string,
    date:   number
}

export { SocketMessage }