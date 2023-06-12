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
            setSelectedOption(user);
            /* console.log("Selected", setSelectedOption); */
        }
    }

    return (
        <span className={selectedOption == user ? "ChatOption active" : "ChatOption"} onClick={selectUser}>
            <Avatar src={user.avatar} />
            <span>{user.name}</span>
        </span>
    );
}