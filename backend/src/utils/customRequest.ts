import { Request } from 'express';
import { IUser } from '../models/user.models';

export interface CustomRequest extends Request {
    user?: IUser;
}
