import { SocketService } from "../../services";

export async function sendText (socket:SocketService, data: any)
{
    socket?.send({
        type:"text",
        time:new Date(),
        data
    });
}