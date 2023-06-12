import {PropsWithChildren} from "react";
import "./style.css";

export function Panel ({children} : PropsWithChildren)
{
    return (
        <div className="Panel">
            <div className="PanelContent">
                {children}
            </div>
        </div>
    )
}