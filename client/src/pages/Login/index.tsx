import {useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Panel } from "../../components";
import { IDictionaryString, IUser } from "../../interfaces";
import { login } from "../../services";
import { GuardContext } from "../../contexts";

export function Login ()
{
    const { setUser } = useContext(GuardContext);
    const navigate = useNavigate();

    async function callback (data : IDictionaryString) 
    {
        //console.log("Enviando...", data);
        const response = await login(data);
        //console.log("Recebendo...", response);
        return response;
    }

    function success (data: IUser)
    {
        if(setUser) setUser(data);
        navigate("/");
    }

    return (
        <main>
            <Panel>
                <h2>Login</h2>
                <Form submitText="Entrar" callback={callback} success={success}>
                    <Input 
                        type="text" 
                        name="email" 
                        placeholder="Email" 
                        pattern={{
                            regex:/\w*@gmail\.com(\.\w{2})?/gim, 
                            error:"O email digitado não é válido!"
                        }}
                    />
                    <Input 
                        type="password" 
                        name="password" 
                        placeholder="Senha" 
                        /* pattern={{
                            regex:/\w*@gmail\.com(\.\w{2})?/gim, 
                            error:"O email digitado não é válido!"
                        }} */
                    />
                </Form>
                <Link to={"/register"}>Ir para Cadastro</Link>
            </Panel>
        </main>
    );
}