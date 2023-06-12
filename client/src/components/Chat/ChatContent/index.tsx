import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { IChatData, IMessage, IMessageData } from "../../../interfaces";
import { ChatMessage } from "./ChatMessage";
import { useChatContext } from "../ChatHook";
import { Avatar } from "../../Avatar";
import "./style.css";
import { ChatControl } from "../ChatControl";

export function ChatContent ()
{
    const {user, users, selectedOption, socket, chatData, setChatData} = useChatContext();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const ulRef = useRef<HTMLDivElement>(null);
    const lastItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => 
    {
        console.log("Selected", selectedOption?.name, chatData);
        if(selectedOption) setMessages(chatData![selectedOption.id]);
        else setMessages([]);
    }, [user, selectedOption, chatData]);

    const receiveMessageText = useCallback(async (data: IMessageData) =>
    {
        if(!users?.length) return;

        const owner = users.find(user => user.id == data.owner);
        const target = users.find(user => user.id == data.target);

        console.log("Received Text", data, owner, target, users);

        if(!owner || !target) return;

        const self = data.owner === user?.id;
        const id = self ? data.target : data.owner;

        const msg : IMessage = {
            ...data,
            owner,
            target
        };

        console.log("ChatData", chatData);

        const msgData = chatData![id!];
        chatData![id!] = [...msgData, msg];
        
        if(setChatData) setChatData({...chatData!});
    }, [user, users, selectedOption, chatData]);

    useEffect(() => 
    {
        if(socket)
        {
            socket.on("text", receiveMessageText);
        }
    }, [socket, user, users, selectedOption, messages]);

    const messageList = useMemo(() => 
    {
        return messages.map((message, index) => 
        {
            return (
                <li key={`message:${index}`} className={message.owner.id === user?.id ? "owner" : ""}>
                    <ChatMessage message={message} />
                </li>
            );
            
        });
    }, [user, messages]);

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
                <Avatar src={selectedOption?.avatar}/>
                <h4>{selectedOption?.name}</h4>
            </span>
            <div className="messages" ref={ulRef}>
               <ul>{messageList}</ul>
               <div ref={lastItemRef}></div>
            </div>
            <ChatControl />
        </div>
    );
}