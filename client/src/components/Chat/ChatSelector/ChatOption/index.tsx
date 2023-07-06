import { IOther } from "../../../../interfaces";
import { Avatar } from "../../../Avatar";
import { useChatContext } from "../../ChatHook";

export function ChatOption ({user} : {user : IOther})
{
    const {selectedOption, setSelectedOption} = useChatContext();

    function selectUser ()
    {
        if(setSelectedOption)
        {
            setSelectedOption(user.id);
            /* console.log("Selected", setSelectedOption); */
        }
    }

    const active = selectedOption == user.id? " active" : "";
    const online = user.online? " online" : "";

    return (
        <span className={`ChatOption${active}${online}`} onClick={selectUser}>
            <Avatar src={user.avatar} />
            <span>{user.name}</span>
        </span>
    );
}