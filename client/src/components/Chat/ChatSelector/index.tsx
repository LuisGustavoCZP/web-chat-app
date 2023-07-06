import { useMemo, useEffect } from "react";
import { IOther } from "../../../interfaces";
import { useChatContext } from "../ChatHook";
import { ChatOption } from "./ChatOption";
import "./style.css";

export function ChatSelector ()
{
    const {users, user, onlineUsers} = useChatContext();
    
    const userList = useMemo<IOther[]>(() => 
    {
        return users?.filter(u => u.id != user?.id).map((u) => { return {...u, online: onlineUsers?.has(u.id)}; }) || [];
    }, [user, users, onlineUsers]);

    return (
        <div className="ChatSelector">
            <h3>Conversas</h3>
            <div className="content">
                {userList?.map((user, index) => <ChatOption key={`user:${index}`} user={user} />)}
            </div>
        </div>
    );
}