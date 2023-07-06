import { FormEvent, useState } from "react";
import "./style.css";

interface InputProps 
{
    label?: string;
    type?: string;
    name: string;
    placeholder?: string;
    pattern?: {
        regex: RegExp;
        error: string;
    },
    defaultValue?: string;
}

export function Input ({label, type="text", name, placeholder, pattern, defaultValue} : InputProps) 
{
    const [status, setStatus] = useState("");

    function checkPattern (e : FormEvent)
    {
        if(!pattern)
        {
            setStatus("");
            return;
        }

        const {regex, error} = pattern;
        const target = e.target as HTMLInputElement;
        const value = target.value;

        if(!regex.test(value))
        {
            setStatus(error);
            throw new Error(error);
        }
    }

    // onInput={checkPattern}
    return (
        <span className="Input">
            {label? <label>{label}</label> : null}
            <input type={type} name={name} placeholder={placeholder} defaultValue={defaultValue} onChange={checkPattern}/>
            {status? <span>{status}</span> : null}
        </span>
    );
}