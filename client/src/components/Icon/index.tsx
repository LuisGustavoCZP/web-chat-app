import {PropsWithChildren, CSSProperties} from "react";
import "./style.css";

interface IconProps extends PropsWithChildren
{
    onClick? : () => void
    src : string;
    className? : string;
    text? : string;
    size? : string;
    image? : boolean;
    color? : string;
}

export function Icon ({src, className, text, onClick, size, image, color} : IconProps)
{
    const style : CSSProperties = {}

    if(image)
    {
        style.backgroundImage = `url(${src})`;
        if(color) style.backgroundColor = color;
    }
    else
    {
        style.WebkitMaskImage = `url(${src})`;
        style.maskImage = `url(${src})`;
        if(color) style.backgroundColor = color;
    }

    if(size)
    {
        style.width = style.height = size;
    }

    const extraClasses = `${className?` ${className}`:""}${onClick ? " clickable" : ""}`;

    return (
        <div className={`Icon${extraClasses}`} onClick={onClick}>
            <span className={`icon${image?" image":""}`} style={style}></span>
        </div>
    );
}