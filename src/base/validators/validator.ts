export abstract class Validator
{
    data : any;
    errors? : string;

    constructor(data : any)
    {
        this.data = data;
        this.errors = "";
    }
}