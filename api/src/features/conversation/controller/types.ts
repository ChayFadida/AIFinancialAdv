import { Request } from 'express';
import { UserType } from 'src/features/user/models';

export interface GetConversationRequestType extends Request {
  user: UserType;
}

export interface SaveMessageRequestType extends Request {
  user: UserType;
  body: {
    question: string;
    answer: string;
  };
}
