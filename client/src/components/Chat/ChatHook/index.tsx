import { useContext } from "react";
import { ChatContext } from "../ChatContext";

export function useChatContext () 
{
    const {
        user,
        selected: selectedOption,
        setSelected: setSelectedOption,
        socket,
        users,
        chatData,
        setChatData,
        onlineUsers,
    } = useContext(ChatContext);

    return {user, users, selectedOption, setSelectedOption, chatData, setChatData, socket, onlineUsers};
}