import { Router } from 'express';
import { getConversation, saveMessage } from '../controller/conversationController';
import { auth } from '../../../middleware';

const conversationRouter = Router();

// Fetch conversation for a specific user
conversationRouter.get('/', auth, getConversation);

// Save a new message to a conversation
conversationRouter.post('/', auth, saveMessage);

export { conversationRouter };
