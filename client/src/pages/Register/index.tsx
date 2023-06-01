import { Link } from "react-router-dom";
import { Form } from "../../components/Form";

export function Register ()
{
    async function callback (data : {[key: string]:any}) 
    {
        console.log("Enviando...", data);
        return false;
    }
    
    return (
        <main>
            <h2>Register</h2>
            <Form submitText="Registrar" callback={callback}>
                <input name="username" placeholder="Username" />
                <input name="password" placeholder="Password" />
            </Form>
            <Link to={"/login"}>Logar</Link>
        </main>
    );
}