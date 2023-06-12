import { IOther } from ".";

export interface IUser extends IOther
{
    id: string;
    name: string;
    email?: string;
    avatar?: string;
}