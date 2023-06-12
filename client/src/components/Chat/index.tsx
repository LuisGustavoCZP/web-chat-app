import "./style.css";
import { ChatContent } from "./ChatContent";
import { ChatSelector } from "./ChatSelector";
import { ChatProvider } from "./ChatContext";

export function Chat ()
{
    return (
        <ChatProvider>
            <div className="Chat">
                <div>
                    <ChatSelector />
                    <ChatContent />
                </div>
            </div>
        </ChatProvider>
    );
}