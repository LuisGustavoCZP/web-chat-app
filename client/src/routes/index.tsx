import { Routes, Route } from "react-router-dom";
import { Home, Login, Register, Logout } from "../pages";
import { GuardProvider } from "../contexts";
import { Header } from "../components";

export function Router ()
{
    return (
        <Routes>
            <Route path="/" element={<GuardProvider isPrivate={true}><Header /><Home /></GuardProvider>} />
            <Route path="/:id" element={<GuardProvider isPrivate={true}><Header /><Home /></GuardProvider>} />
            <Route path="/login" element={<GuardProvider><Header /><Login /></GuardProvider>} />
            <Route path="/register" element={<GuardProvider><Header /><Register /></GuardProvider>} />
            <Route path="/logout" element={<GuardProvider isPrivate={true}><Logout /></GuardProvider>} />
        </Routes>
    )
}