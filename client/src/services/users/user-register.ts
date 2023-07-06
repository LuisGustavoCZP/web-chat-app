import { IDictionaryString, IResponse } from "../../interfaces";
import { api } from "../api";

export async function register(data : IDictionaryString) 
{
    return await api.post("/users", data) as IResponse;
}