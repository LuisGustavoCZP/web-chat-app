import { IDictionaryString } from "../interfaces";

const { VITE_API_URL } = import.meta.env;

function errorCallback(err: any) {
    throw new Error(`${err}`);
}

function queryStringfy (query? : IDictionaryString) 
{
    if(!query) return "";
    
    return `?${Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&")}`;
}

export class API
{
    api_url : string;

    constructor (url : string)
    {
        this.api_url = url;
    }

    async get (path : string, query? : IDictionaryString)
    {
        const queryString = queryStringfy(query);
        const url = `${this.api_url}${path}${queryString}`;
        console.log(url);
        return await fetch(url, {
            method: "GET",
            headers: {
                /* "Authorization": getUserEmail() as string, */
            },
            credentials: "include"
        }).then(resp => {
            console.log("GET", path, resp.status);
            return resp.json();
        }).catch(errorCallback);
    }

    async post (path : string, data : any)
    {
        return await fetch(`${this.api_url}${path}`, {
            method: "POST",
            headers: {
                /* "Authorization": getUserEmail() as string, */
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        }).then(resp => {
            console.log("POST", path, resp.status);
            return resp.json();
        }).catch(errorCallback);
    }

    async put (path : string, data : any)
    {
        return await fetch(`${this.api_url}${path}`, {
            method: "PUT",
            headers: {
                /* "Authorization": getUserEmail() as string, */
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        }).then(resp => {
            console.log("PUT", path, resp.status);
            return resp.json();
        }).catch(errorCallback);
    }

    async delete (path : string, data : any)
    {
        return await fetch(`${this.api_url}${path}`, {
            method: "DELETE",
            headers: {
                /* "Authorization": getUserEmail() as string, */
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        }).then(resp => {
            console.log("DELETE", path, resp.status);
            return resp.json();
        }).catch(errorCallback);
    }
}
console.log("API_URL", VITE_API_URL);
export const api = new API(VITE_API_URL || "/api");