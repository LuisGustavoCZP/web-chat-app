import { useContext } from "react";
import { GuardContext } from "../../contexts";

export function useGuardContext () 
{
    const {user, setUser} = useContext(GuardContext);

    return {user, setUser};
}