import { KeyboardEvent, useRef } from "react";
import { IDictionaryString, IResponse, IUser } from "../../../interfaces";
import { Form } from "../../Form";
import { Icon } from "../../Icon";
import "./style.css";
import { useChatContext } from "../ChatHook";
import { sendText } from "../../../services/chat";

export function ChatControl ()
{
    const {socket, selectedOption} = useChatContext();
    const formRef = useRef<HTMLButtonElement>(null);
    function onKeyDownText (e : KeyboardEvent)
    {  
        if(e.key == "Enter" && !e.shiftKey)
        {
            e.preventDefault();
            formRef.current?.click();
        }
    }

    async function callback (data : IDictionaryString) 
    {   
        data.target = selectedOption?.id;
        data.time = new Date();
        sendText(socket!, data);
        return {};
    }

    return (
        <div className="ChatControl">
            <Form ref={formRef} callback={callback} submitButton={<img src="./public/vite.svg" />}>
                <textarea name="text" onKeyDown={onKeyDownText} style={{}}/>
            </Form>
        </div>
    );
}