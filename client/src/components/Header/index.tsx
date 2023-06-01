import "./style.css";
import logo from "../../assets/logo.png";

export function Header ()
{
    return (
        <header className="Header">
            <img className="logo" src={logo}/>
            <h1>WebChat</h1>
        </header>
    );
}