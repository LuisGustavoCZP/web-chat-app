import { RegexValidator } from "../../base/validators/strings/regex-validator";

export class SessionIDValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /^[0-9A-Fa-f-]{36}$/gim;
    }
}