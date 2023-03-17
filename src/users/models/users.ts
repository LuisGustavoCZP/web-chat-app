import bcrypt from "bcrypt";
import * as models from "../../base/models";
import { settings } from "../../base";
import { UserValidator } from "../validators";

export class User extends models.Model
{
    email : string;
    name : string;
    password : string;

    constructor (data : any)
    {
        super();
        this.email = data.email;
        this.name = data.name;
        this.password = data.password;
        if(data.id) this.id = data.id;
    }

    public override get tableName () 
    {
        return 'users';
    }

    public static override async filter(data?: { [key: string]: string; } | undefined): Promise<User[]> 
    {
        return (await super.filter(data)).map(value => new User(value));
    }

    public override validate ()
    {
        const validator = new UserValidator(this);
        if(validator.errors)
        {
            throw new Error(validator.errors);
        }
    }

    protected override async create()
    {
        this.password = await bcrypt.hash(this.password, settings.hashSecret);
        return super.create();
    }

    protected override async update()
    {
        this.password = await bcrypt.hash(this.password, settings.hashSecret);
        return super.update();
    }

    public async passwordCheck (password : string)
    {
        return await bcrypt.compare(password, this.password);
    }

}