export interface IModel 
{
    [key : string] : {
        type: string,
        size?: number,
        required?: boolean,
        unique?: boolean,
        pk?: boolean
        default?: any
    }
}