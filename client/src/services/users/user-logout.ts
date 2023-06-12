import { IResponse } from "../../interfaces";
import { api } from "../api";

export async function logout()
{
    return await api.delete("/logout", {}) as IResponse;
}