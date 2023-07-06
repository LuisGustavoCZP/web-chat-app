import { KeyboardEvent, useRef, useEffect, useState } from "react";
import { IDictionaryString, IResponse, IUser } from "../../../interfaces";
import { Form } from "../../Form";
import "./style.css";
import { useChatContext } from "../ChatHook";
import { sendText } from "../../../services/chat";
import { Icon } from "../../Icon";

export function ChatControl ()
{
    const {socket, selectedOption} = useChatContext();
    const [disabled, setDisabled] = useState(true);

    const formRef = useRef<HTMLButtonElement>(null);
    function onKeyDownText (e : KeyboardEvent)
    {  
        if(e.key == "Enter" && !e.shiftKey)
        {
            e.preventDefault();
            formRef.current?.click();
        }
        else if(e.key == "Backspace")
        {
            const target = e.target as HTMLTextAreaElement;
            if(target.value.length <= 1) setDisabled(true);
        }
        else
        {
            if(/\w/gi.test(e.key))
            {
                setDisabled(false);
            }
        }
    }

    async function callback (data : IDictionaryString) 
    {   
        setDisabled(true);
        data.target = selectedOption;
        data.time = new Date();
        sendText(socket!, data);
        return {};
    }

    useEffect(() => 
    {
        formRef.current!.disabled = disabled;
    }, [disabled, formRef.current]);

    return (
        <div className="ChatControl">
            
            <Form ref={formRef} callback={callback} submitButton={<Icon size={"2em"} src="./public/send-icon.svg" />}>
                <textarea name="text" onKeyDown={onKeyDownText} style={{}}/>
            </Form>
        </div>
    );
}