import { IDictionaryString, IResponse } from "../../interfaces";
import { api } from "../api";

export async function login(data : IDictionaryString) 
{
    return await api.post("/login", data) as IResponse;
}