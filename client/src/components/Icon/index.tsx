import {PropsWithChildren} from "react";
import "./style.css";

interface IconProps extends PropsWithChildren
{
    onClick? : () => void
}

export function Icon ({children, onClick} : IconProps)
{
    return (
        <div className={`Icon ${onClick ? "clickable" : ""}`} onClick={onClick}>
            {children}
        </div>
    );
}