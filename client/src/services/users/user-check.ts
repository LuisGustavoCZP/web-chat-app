import { IResponse } from "../../interfaces";
import { api } from "../api";

export async function getSelf ()
{
    return await api.get("/users/self") as IResponse;
}