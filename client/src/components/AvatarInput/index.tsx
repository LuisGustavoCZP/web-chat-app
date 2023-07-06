import { FormEvent, useEffect, useState } from "react";
import "./style.css";
import { convertBase64 } from "../../utils";

interface AvatarInputProps 
{
    src?: string;
}

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
const context = canvas.getContext("2d");

export function AvatarInput ({src} : AvatarInputProps)
{
    const [img, setImage] = useState<string | undefined>(src);
    const [inputRef, setInputRef] = useState<HTMLInputElement>();
    function click ()
    {
        inputRef!.click();
    }

    async function change (e : FormEvent<HTMLInputElement>)
    {
        const target = e.target as HTMLInputElement;
        const file = target?.files![0];
        let url = undefined; 
        if(file)
        {
            const fileData = await convertBase64(file);
            const img = new Image();
            img.src = fileData;

            await new Promise((resolve) => { img.onload = resolve; });

            const MAX_WIDTH = 256;
            const MAX_HEIGHT = 256;

            const width = Math.min(MAX_WIDTH, img.width);
            const height = Math.min(MAX_HEIGHT, img.height);

            const m = Math.min(width, height);

            canvas.width = m;
            canvas.height = m;

            context?.drawImage(img, 0, 0, width, height);

            url = canvas.toDataURL("image/webp");
        }
        setImage(url);
    }

    useEffect(() => 
    {
        setInputRef(document.querySelector(".AvatarInput input") as any);
    }, []);

    return (
        <span className="AvatarInput" onClick={click}>
            <input 
                hidden
                type="file"
                accept={".jpeg, .png, .webp"}
                onChange={change}
            />
            <input 
                hidden
                type="text" 
                name="avatar"
                value={img || ""}
                readOnly
            />
            <img src={img || "./avatar.png"}/>
        </span>
    )
}