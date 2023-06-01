import { RegexValidator } from "./regex-validator";

export class NameValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /^([a-z]{1,})([ ]{1}[a-z]{1,}){0,}$/gim;
    }
}