import "./style.css";

export function Avatar ({src} : {src?:string})
{
    return (
        <img className="Avatar" src={src || "./avatar.png"}/>
    );
}