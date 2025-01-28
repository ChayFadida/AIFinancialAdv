import { Request } from 'express';

export interface SaveContactRequestType extends Request {
    body: {
        name: string;
        email: string;
        message: string;
    };
}