import { Link, useNavigate } from "react-router-dom";
import { Form } from "../../components/Form";
import { IDictionaryString } from "../../interfaces";
import { Input, Panel } from "../../components";
import { register } from "../../services";

export function Register ()
{
    const navigate = useNavigate();
    
    async function callback (data : IDictionaryString) 
    {
        //console.log("Enviando...", data);
        const response = await register(data);
        //console.log("Recebendo...", response);
        return response;
    }

    function success ()
    {
        navigate("/login");
    }
    
    return (
        <main>
            <Panel>
                <h2>Register</h2>
                <Form submitText="Registrar" callback={callback} success={success}>
                    <Input
                        type="text"
                        name="email"
                        placeholder="Email"
                        pattern={{
                            regex:/^\w*@gmail\.com(\.\w{2})?$/gim, 
                            error:"O email digitado não é válido!"
                        }}
                    />
                    <Input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        pattern={{
                            regex:/\w*@gmail\.com(\.\w{2})?/gim, 
                            error:"O email digitado não é válido!"
                        }}
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        pattern={{
                            regex:/\w*@gmail\.com(\.\w{2})?/gim, 
                            error:"O email digitado não é válido!"
                        }}
                    />
                </Form>
                <Link to={"/login"}>Ir para Login</Link>
            </Panel>
        </main>
    );
}