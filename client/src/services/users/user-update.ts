import { IDictionaryString, IResponse } from "../../interfaces";
import { api } from "../api";

export async function update(data : IDictionaryString) 
{
    return await api.put(`/users`, data) as IResponse;
}