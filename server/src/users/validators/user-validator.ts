import { Validator, EmailValidator, NameValidator, PasswordValidator } from "../../base/validators";
import { IUser } from "../interfaces";

export class UserValidator extends Validator
{
    constructor (data : IUser)
    {
        super(data);

        this.data.email = this.checkEmail(data.email);
        this.data.name = this.checkName(data.name);
        //this.data.password = this.checkPassword(data.password);
    }

    checkEmail (email : string)
    {
        const validator = new EmailValidator(email, {max_length:255});
        if(validator.errors) this.errors += `email:${validator.errors},`;
        return validator.data;
    }

    checkName (name : string)
    {
        const validator = new NameValidator(name, {max_length:255});
        if(validator.errors) this.errors += `name:${validator.errors},`;
        return validator.data;
    }

    checkPassword (password : string)
    {
        const validator = new PasswordValidator(password, {max_length:255});
        if(validator.errors) this.errors += `password:${validator.errors},`;
        return validator.data;
    }
}