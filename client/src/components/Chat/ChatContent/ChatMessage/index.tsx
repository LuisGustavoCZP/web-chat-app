import { IMessage } from "../../../../interfaces";
import { Avatar } from "../../../Avatar";

export function ChatMessage ({message} : {message : IMessage})
{
    const {text, owner, time} = message;


    return (
        <div className="ChatMessage">
            <span className="user">
                <Avatar src={owner.avatar} />
                <span>{owner.name}</span>
            </span>
            <span className="text">{text}</span>
            <span className="time">{time.toLocaleString()}</span>
        </div>
    );
}