import { useMemo } from "react";
import { IOther } from "../../../interfaces";
import { useChatContext } from "../ChatHook";
import { ChatOption } from "./ChatOption";
import "./style.css";

export function ChatSelector ()
{
    const {users, user} = useChatContext();
    const userList = useMemo<IOther[]>(() => 
    {
        return users?.filter(u => u.id != user?.id) || [];
    }, [user, users])

    return (
        <div className="ChatSelector">
            <h3>Conversas</h3>
            <div className="content">
                {userList?.map((user, index) => <ChatOption key={`user:${index}`} user={user} />)}
            </div>
        </div>
    );
}