import { Routes, Route } from "react-router-dom";
import { Main, Login, Register } from "../pages";

export function Router ()
{
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}