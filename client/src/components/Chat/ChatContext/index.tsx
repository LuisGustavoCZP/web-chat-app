import { createContext, useState, PropsWithChildren, Dispatch, useEffect } from "react";
import { IChatData, IOther, IUser } from "../../../interfaces";
import { SocketService, userList } from "../../../services";
import { useGuardContext } from "../../../hooks";

interface IChatProvider
{
    user?: IUser;
    selected?: IOther;
    setSelected?: Dispatch<IOther | undefined>;
    socket?: SocketService;
    users?: IOther[];
    chatData?: IChatData;
    setChatData?: Dispatch<IChatData>;
}

const DEFAULT : IChatProvider = {}

export const ChatContext = createContext(DEFAULT);

export function ChatProvider ({children} : PropsWithChildren)
{
    const {user} = useGuardContext();
    const [selected, setSelected] = useState<IOther | undefined>();
    const [socket, setSocket] = useState<SocketService>();
    const [users, setUsers] = useState<IOther[]>([]);
    const [chatData, setChatData] = useState<IChatData>({});
    
    async function startSocket ()
    {
        if(socket) 
        {
            await socket.start();
            
            const msgUser = {
                type: "session",
                data: {userid: user?.id},
                date: Date.now()
            };

            socket.send(msgUser);
        }
    }

    async function loadUsers() 
    {
        const response = await userList();
        const list = response.data;
        console.log("List", list);
        setUsers(list);
    }

    useEffect(() => 
    {
        loadUsers();
    }, []);

    useEffect(() => 
    {
        const set = new Set(Object.keys(chatData));
        users.forEach((user) => 
        {
            if(!chatData[user.id]) chatData[user.id] = [];
            else set.delete(user.id);
        });

        set.forEach((id) => 
        {
            delete chatData[id];
        });
    }, [users]);

    useEffect(() => 
    {
        if(!socket) 
        {
            const s = new SocketService();
            setSocket(s);
        }
    }, [user]);

    useEffect(() => 
    {
        startSocket();
    }, [socket]);

    const value = {
        user,
        users,
        selected,
        setSelected,
        socket,
        chatData,
        setChatData
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}