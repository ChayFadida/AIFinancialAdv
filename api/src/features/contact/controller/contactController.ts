import { Response } from 'express';
import { catchAsync } from '../../../utils';
import { Contact } from '../models/contactSchema';
import { SaveContactRequestType } from './types';

export const saveContact = catchAsync(async (req: SaveContactRequestType, res: Response) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        throw 'All fields are required';
    }

    const contact = new Contact({
        name,
        email,
        message,
        timestamp: new Date()
    });

    await contact.save();
    return res.status(200).json({ message: 'Message sent successfully' });
});