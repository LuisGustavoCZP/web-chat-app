import { useEffect } from "react";
import { logout } from "../../services";
import { useGuardContext } from "../../hooks";

export function Logout ()
{
    const {user, setUser} = useGuardContext();

    async function onLoad ()
    {
        const response = await logout();
        if(!response.messages.length)
        {
            console.log("Logout!");
            if(setUser) setUser(undefined);
        }
    }

    useEffect(() => 
    {
        onLoad ();
    }, [])

    return (
        <main>
            <h2>Deslogando...</h2>
        </main>
    );
}