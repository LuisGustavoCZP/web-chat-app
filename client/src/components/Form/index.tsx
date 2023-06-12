import { FormEvent, PropsWithChildren, useState, ReactNode, Ref, forwardRef } from "react";
import { IDictionaryString, IResponse } from "../../interfaces";
import "./style.css";

export interface FormProps extends PropsWithChildren 
{
    submitButton?: string | ReactNode;
    callback: (data: IDictionaryString) => Promise<IResponse>;
    success?: (data?: any) => void;
    fail?: () => void;
}

export const Form = forwardRef<HTMLButtonElement, FormProps>(({children, submitButton="Enviar", callback, success, fail} : FormProps, ref : Ref<HTMLButtonElement>) =>
{
    const [messages, setMessages] = useState<string[]>([]);

    async function submitHandle (e : FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const objectData = Object.fromEntries(formData.entries())

        const {data, messages} = await callback(objectData);
        
        if(!messages?.length)
        {
            if(success) success(data);
            setMessages([]);
            target.reset();
        }
        else 
        {
            if(fail) fail();
            setMessages(messages);
        }
    }

    function renderMessage(message: string)
    {
        const [h, t] = message.split(":");
        return (
            <span className="message">
                <span>{h}</span>
                <span>{t}</span>
            </span>
        );
    }

    function renderMessages(messages: string[])
    {
        return (
            <div className="messages">
                {
                    messages.map(message => renderMessage(message))
                }
            </div>
        );
    }

    return (
        <form className="Form" onSubmit={submitHandle}>
            {children}
            <button ref={ref}>{submitButton}</button>
            {
                renderMessages(messages)
            }
        </form>
    );
})