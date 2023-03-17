import { Validator } from "./validator";

export abstract class StringValidator extends Validator
{
    constructor(data : any, extra?: {max_length? : number})
    {
        super(data);

        if(typeof data != 'string') this.errors = 'type is wrong';
        else if(extra && extra.max_length)
        {
            if(data.length > extra.max_length) this.errors = 'string is too long';
        }
    }
}