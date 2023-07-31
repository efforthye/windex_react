import { Schema, Document, model } from 'mongoose';
import { IAdmin } from '../interfaces';

const AdminSchema: Schema = new Schema({
    name: {
        type: String,
    },
    id: {
        type: String,
    },
    password: {
        type: String,
        default: 'test',
    },
    email: {
        type: String,
    },
    authority: {
        type: Number,
        required: true,
        default: 0,
    },
    account: {
        type: String,
        required: true,
        unique: true,
        default: '0x68776746d0d9f615b3ed0dfa970c73c45458a4a3',
    },
});

const Admin = model<IAdmin>('Admin', AdminSchema);

export default Admin;
