import { model, Schema } from 'mongoose';

import { UserType } from './UserType';

const UserSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      minlength: [2, 'Email must be at least 2 characters long'],
      maxlength: [50, 'Email cannot exceed 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
    },
    stocks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const modelName = 'User';

export const User = model<UserType>(modelName, UserSchema);
