import { RegexValidator } from "../../base/validators";

export class UsernameValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /(\w{1,}[ ])*\w{1,}/gi;
    }
}