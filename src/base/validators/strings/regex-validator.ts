import { StringValidator } from "../string-validator";

export abstract class RegexValidator extends StringValidator
{
    protected get regexp () : RegExp
    {
        return new RegExp('');
    }

    constructor(data : any, extra?: {max_length? : number})
    {
        super(data, extra);
        if(this.errors) return;
        if(!this.regexp.test(data)) this.errors = 'format is not compatible';
    }
}