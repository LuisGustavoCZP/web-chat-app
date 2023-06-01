import { FormEvent, PropsWithChildren } from "react";

export interface FormProps extends PropsWithChildren 
{
    submitText?: string;
    callback: (data: {[key : string] : any}) => Promise<boolean>;
    success?: () => void;
    fail?: () => void;
}

export function Form ({children, submitText="Enviar", callback, success, fail} : FormProps)
{
    async function submitHandle (e : FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries())

        const isSuccess = await callback(data);

        if(isSuccess)
        {
            if(success) success();
        }
        else 
        {
            if(fail) fail();
        }
    }

    return (
        <form onSubmit={submitHandle}>
            {children}
            <button>{submitText}</button>
        </form>
    );
}