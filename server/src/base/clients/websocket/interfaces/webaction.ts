import { IWebData, SocketData } from "./webdata";
import WebSocket from "ws";

export type Socket = WebSocket.WebSocket;
export type SocketAction = (ws: Socket, socketData?: IWebData) => void;
export type WebAction = (data : IWebData) => void;