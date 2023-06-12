import { IResponse } from "../../interfaces";
import { api } from "../api";

export async function userList () 
{
    return await api.get("/users") as IResponse;    
}