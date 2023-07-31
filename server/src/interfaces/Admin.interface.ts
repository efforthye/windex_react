import { Document } from 'mongoose';

export default interface IAdmin extends Document {
    name: string;
    id: string;
    password: string;
    email: string;
    authority: number;
    account: string;
}
