import { model, Schema } from 'mongoose';

const ConversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: {
      type: [
        {
          sender: { type: String, required: true, default: 'user' },
          content: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true }
);

const modelName = 'Conversation';

export const Conversation = model(modelName, ConversationSchema);
