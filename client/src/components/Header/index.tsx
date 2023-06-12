import { ReactNode, useMemo, useState } from "react";
import logo from "../../assets/logo.png";
import { Avatar } from "../Avatar";
import { Icon } from "../Icon";
import "./style.css";
import { useGuardContext } from "../../hooks";
import { UserOptions } from "../UserOptions";

export function Header ()
{
    const [ modal, setModal ] = useState<ReactNode>();
    const { user } = useGuardContext();

    function click ()
    {
        if(!user) return;
        const close = () => setModal(null);
        setModal(<UserOptions close={close} setModal={setModal}/>);
    }

    const userAvatar = useMemo(() => {
        if(!user) return null;
        return (
            <Icon onClick={click}>
                <Avatar src={user?.avatar}/>
            </Icon>
        )
    }, [user]);

    return (
        <>
            <header className="Header">
                <div className="logo">
                    <img src={logo}/>
                    <h1>WebChat</h1>
                </div>
                <div className="content">
                    {userAvatar}
                    {modal}
                </div>
            </header>
        </>
    );
}