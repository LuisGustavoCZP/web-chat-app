import { useEffect, useMemo, useRef, useState } from "react";
import { IMessage, IMessageData, IOther } from "../../../interfaces";
import { Avatar } from "../../Avatar";
import { ChatControl } from "../ChatControl";
import { useChatContext } from "../ChatHook";
import { ChatMessage } from "./ChatMessage";
import "./style.css";

export function ChatContent ()
{
    const {user, users, selectedOption, chatData} = useChatContext();
    const [messages, setMessages] = useState<IMessageData[]>([]);
    const [selectedUser, setSelectedUser] = useState<IOther | undefined>();
    const ulRef = useRef<HTMLDivElement>(null);
    const lastItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => 
    {
        console.log("Selected", selectedOption, chatData);
        if(selectedOption) 
        {
            setMessages(chatData![selectedOption]);
            setSelectedUser(users?.find(user => user.id == selectedOption));
        }
        else 
        {
            setMessages([]);
            setSelectedUser(undefined);
        }
    }, [user, users, selectedOption, chatData]);

    const messageList = useMemo(() => 
    {
        return messages.map((message, index) => 
        {
            const owner = users?.find(user => user.id == message.owner);
            const target = users?.find(user => user.id == message.target);
            message.time = new Date(message.time);

            console.log("Received Text", message, owner, target, users);

            if(!owner || !target) return;

            const msg : IMessage = {
                ...message,
                owner,
                target
            };

            return (
                <li key={`message:${index}`} className={owner.id === user?.id ? "owner" : ""}>
                    <ChatMessage message={msg} />
                </li>
            );
            
        });
    }, [user, messages, users]);

    useEffect(() => 
    {
        lastItemRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messageList])

    if(!user || !users?.length || !selectedOption) return (
        <div className="ChatContent">

        </div>
    );

    return (
        <div className="ChatContent">
            <span className="header">
                <Avatar src={selectedUser?.avatar}/>
                <h4>{selectedUser?.name}</h4>
            </span>
            <div className="messages" ref={ulRef}>
               <ul>{messageList}</ul>
               <div ref={lastItemRef}></div>
            </div>
            <ChatControl />
        </div>
    );
}