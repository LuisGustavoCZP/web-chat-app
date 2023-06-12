import { ReactNode, Dispatch, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { UserSettings } from "../UserSettings";
import "./style.css";

interface UserOptionsProps {
    close : () => void
    setModal : Dispatch<ReactNode>
}

export function UserOptions ({close, setModal}: UserOptionsProps)
{
    const navigate = useNavigate();

    function clickConfigs ()
    {
        const closeModal = () => setModal(null);
        setModal(<UserSettings close={closeModal} />);
    }

    function clickLogout ()
    {
        navigate("/logout");
    }

    function innerClick (e : MouseEvent)
    {
        e.stopPropagation();
    }

    return (
        <aside className="UserOptions">
            <div className="back" onClick={close}></div>
            <div className="panel" onClick={innerClick}>
                <button onClick={clickConfigs}>Configurações</button>
                <button onClick={clickLogout}>Sair</button>
            </div>
        </aside>
        
    );
}