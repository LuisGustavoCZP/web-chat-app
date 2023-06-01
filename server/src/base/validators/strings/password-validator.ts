import { RegexValidator } from "./regex-validator";

export class PasswordValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /^\w{6,}$/gim;
    }
}