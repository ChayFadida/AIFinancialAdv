import { Response } from 'express';
import { catchAsync } from '../../../utils';
import { Conversation } from '../models/ConversationSchema'
import { GetConversationRequestType, SaveMessageRequestType } from './types';
import { aiAxios } from '../../../services/aiAxios';

// Fetch conversation for a specific user
export const getConversation = catchAsync(async (req: GetConversationRequestType, res: Response) => {
  const { user } = req;

  const conversation = await Conversation.findOne({ userId: user._id }).exec();

  if (!conversation) {
    const conversation = new Conversation({
      userId: user._id, messages: [{
        sender: 'chat',
        content: "Hello! I'm your AI Financial Advisor. How can I assist you today?",
        timestamp: new Date(),
      }]
    });

    await conversation.save()
    return res.status(200).json(conversation.messages);
  }

  return res.status(200).json(conversation.messages);
});

// Save a new message to a conversation
export const saveMessage = catchAsync(async (req: SaveMessageRequestType, res: Response) => {
  const { user } = req;
  const { question } = req.body;

  if (!question) {
    throw 'question is required';
  }

  let conversation = await Conversation.findOne({ userId: user._id });

  const userMessage = {
    sender: 'user',
    content: question,
    timestamp: new Date()
  }

  if (!conversation) {
    conversation = new Conversation({
      userId: user._id, messages: [{
        sender: 'chat',
        content: "Hello! I'm your AI Financial Advisor. How can I assist you today?",
        timestamp: new Date(),
      }, userMessage]
    });
  } else {
    conversation.messages.push(userMessage)
  }

  const response: { data: { answer: string } } = await aiAxios.post('/financialChatBot/chat', {
    history: conversation.messages.map(message => ({ content: message.content, role: message.sender })),
    question,
  });

  conversation.messages.push({ sender: 'chat', content: response.data.answer });
  const conversationRes = await conversation.save();

  return res.status(200).json(conversationRes.messages);
});
