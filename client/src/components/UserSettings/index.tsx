import { useMemo } from "react";
import { IUser, IDictionaryString, IResponse } from "../../interfaces";
import { Modal } from "../Modal";
import { Input } from "../Input";
import { AvatarInput } from "../AvatarInput";
import "./style.css";
import { Form } from "../Form";
import { update } from "../../services";
import { useGuardContext } from "../../hooks";

interface UserSettingsProps {
    close : () => void
}

export function UserSettings ({close}: UserSettingsProps)
{
    const { user, setUser } = useGuardContext();

    async function sendForm (data : IDictionaryString) 
    {
        //console.log("Enviando...", data);
        const response : IResponse = await update(data);
        //console.log("Recebendo...", response);
        return response;
    }

    function success (data: IUser[])
    {
        if(setUser) setUser(data[0]);
        close();
        /* if(setUser) setUser(data);
        navigate("/"); */
    }

    const userChat = useMemo(() => (
        <Modal close={close}>
            <div className="UserSettings">
                <h3>Configurações</h3>
                <Form callback={sendForm} success={success}>
                    <div className="inputs">
                        <Input label="Nome" name="name" defaultValue={user?.name} />
                        <AvatarInput src={user?.avatar} />
                    </div>
                    <button type="button" onClick={close}>Cancelar</button>
                </Form>
            </div>
        </Modal>
    ), [user]);

    return userChat;
}