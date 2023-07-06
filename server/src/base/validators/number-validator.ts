import { Validator } from "./validator";

export class NumberValidator extends Validator
{
    constructor(data : any, extra?:{min?:number, max?:number})
    {
        super(data);
        
        if(typeof data != 'number') this.errors = 'type is wrong"';
        if(extra)
        {
            if(extra.max)
            {
                if(data > extra.max) this.errors = 'number greater than max';
            }
            
            if(extra.min)
            {
                if(data > extra.min) this.errors = 'number lesser than min';
            }
        }
    }
}