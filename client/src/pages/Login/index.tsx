import { Link, useNavigate } from "react-router-dom";
import { Form } from "../../components";

export function Login ()
{
    const navigate = useNavigate();

    async function callback (data : {[key: string]:any}) 
    {
        console.log("Enviando...", data);
        navigate("/");
        return false;
    }

    return (
        <main>
            <h2>Login</h2>
            <Form submitText="Entrar" callback={callback}>
                <input name="username" placeholder="Username" />
                <input name="password" placeholder="Password" />
            </Form>
            <Link to={"/register"}>Registrar</Link>
        </main>
    );
}