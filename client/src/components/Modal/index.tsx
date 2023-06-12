import {PropsWithChildren, MouseEvent} from "react";
import "./style.css";

interface ModalProps extends PropsWithChildren 
{
    close: () => void
}

export function Modal ({close, children} : ModalProps)
{
    function outClick (e : MouseEvent)
    {
        close();
    }

    return (
        <div className="Modal" onClick={outClick}>
            <div className="content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}