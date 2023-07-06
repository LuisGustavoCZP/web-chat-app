import { createContext, useState, PropsWithChildren, Dispatch, useEffect, useCallback } from "react";
import { IChatData, IMessageData, IOther, IUser } from "../../../interfaces";
import { SocketService, userList } from "../../../services";
import { useGuardContext } from "../../../hooks";

interface IChatProvider
{
    user?: IUser;
    selected?: string;
    setSelected?: Dispatch<string | undefined>;
    socket?: SocketService;
    users?: IOther[];
    chatData?: IChatData;
    setChatData?: Dispatch<IChatData>;
    onlineUsers?: Set<string>;
}

const DEFAULT : IChatProvider = {}

export const ChatContext = createContext(DEFAULT);

export function ChatProvider ({children} : PropsWithChildren)
{
    const {user} = useGuardContext();
    const [selected, setSelected] = useState<string | undefined>();
    const [socket, setSocket] = useState<SocketService>();
    const [users, setUsers] = useState<IOther[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set<string>());
    const [chatData, setChatData] = useState<IChatData>({});
    
    async function startSocket ()
    {
        if(socket && !socket.opened) 
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

    const listOnlineUsers = useCallback(async (data: any) =>
    {
        setOnlineUsers(new Set<string>(data.users));
        console.log("online-users", data.users);
    }, []);

    const addOnlineUser = useCallback(async (data: any) =>
    {
        onlineUsers.add(data.userid);//[...onlineUsers, data.userid];
        setOnlineUsers(new Set<string>(onlineUsers));
        console.log("online-user", onlineUsers);
    }, [onlineUsers]);

    const removeOnlineUser = useCallback(async (data: any) =>
    {
        onlineUsers.delete(data.userid);//.filter(user => user != data.userid);
        setOnlineUsers(new Set<string>(onlineUsers));
        console.log("offline-user", onlineUsers, data);
    }, [onlineUsers]);

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

        socket?.on("update-user", async () => 
        {
            console.log("update-user");
            await loadUsers();
        });
    }, [users]);

    useEffect(() => 
    {
        if(!socket) 
        {
            const s = new SocketService();

            s.on("online-users", listOnlineUsers);

            s.on("online-user", addOnlineUser);

            s.on("offline-user", removeOnlineUser);

            setSocket(s);
        }
    }, [user]);

    useEffect(() => 
    {
        startSocket();
    }, [socket]);

    const receiveMessageText = useCallback(async (data: IMessageData) =>
    {
        if(!users?.length) return;

        const self = data.owner === user?.id;
        const id = self ? data.target : data.owner;
        
        console.log("ChatData", chatData);

        const msgData = chatData![id!];
        chatData![id!] = [...msgData, data];
        
        if(setChatData) setChatData({...chatData!});
    }, [user, selected, users, chatData]);

    useEffect(() => 
    {
        if(!socket) return;

        socket.on("online-users", listOnlineUsers);

        socket.on("online-user", addOnlineUser);

        socket.on("offline-user", removeOnlineUser);
        
    }, [socket, onlineUsers, addOnlineUser, removeOnlineUser, listOnlineUsers]); //addOnlineUser, removeOnlineUser, listOnlineUsers

    useEffect(() => 
    {
        if(socket)
        {
            socket.on("text", receiveMessageText);
        }
    }, [socket, receiveMessageText]);

    const value = {
        user,
        users,
        selected,
        setSelected,
        socket,
        chatData,
        setChatData,
        onlineUsers
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}