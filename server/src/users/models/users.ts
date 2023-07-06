import bcrypt from "bcrypt";
import * as models from "../../base/models";
import { IWhere, settings } from "../../base";
import { UserValidator } from "../validators";

export class User extends models.Model
{
    email : string;
    name : string;
    password : string;
    avatar: string;

    constructor (data : any)
    {
        super(data);
        this.email = data.email;
        this.name = data.name;
        this.password = data.password;
        this.avatar = data.avatar;
    }

    public override get tableName () 
    {
        return 'users';
    }

    public static override async filter(data?: IWhere): Promise<User[]> 
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
        /* if(this.password)
        {
            const data = await bcrypt.hash(this.password, settings.hashSecret);
            this.password = data;
        } */
        return super.update();
    }

    public async passwordCheck (password : string)
    {
        return await bcrypt.compare(password, this.password);
    }

}