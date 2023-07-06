import { RegexValidator } from "./regex-validator";

export class EmailValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /^(\w{1,}\@\w{1,}\.\w{3}(\.\w{2}){0,1})$/gim;
    }
}