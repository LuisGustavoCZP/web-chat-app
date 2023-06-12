import { createContext, useState, useEffect, useLayoutEffect, PropsWithChildren, Dispatch } from "react";
import { Navigate } from "react-router-dom";
import { IUser } from "../interfaces";
import { getSelf } from "../services";

interface IGuardProps extends PropsWithChildren 
{
    isPrivate?: boolean;
}

interface IGuardProvider
{
    user?: IUser | undefined;
    setUser?: Dispatch<IUser | undefined> 
}

const DEFAULT : IGuardProvider = {}

export const GuardContext = createContext(DEFAULT);

export function GuardProvider ({children, isPrivate=false} : IGuardProps)
{
    const [user, setUser] = useState<IUser | undefined>();
    const [loading, setLoading] = useState(true);

    async function loadUser()
    {
        setLoading(true);
        const response = await getSelf();
        setUser(response.data);
        setLoading(false);
    }

    const value = {
        user,
        setUser
    }

    useEffect(() => 
    {
        loadUser();
    }, []);

    if(loading) return null;

    if(isPrivate)
    {
        if(user)
        {
            return (
                <GuardContext.Provider value={value}>
                    {children}
                </GuardContext.Provider>
            );
        }
        else return <Navigate to={"/login"} />;
    }
    else 
    {
        if(!user)
        {
            return (
                <GuardContext.Provider value={value}>
                    {children}
                </GuardContext.Provider>
            );
        }   
        else return <Navigate to={"/"} />;
    }
}