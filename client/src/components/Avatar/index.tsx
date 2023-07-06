import { Icon } from "../Icon";
import "./style.css";


export function Avatar ({src, onClick} : {src?:string, onClick? : () => void})
{
    return (
        <Icon className="Avatar" image src={src || "./avatar.png"} onClick={onClick}/>
    );
}