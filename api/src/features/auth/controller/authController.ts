import bcrypt from 'bcryptjs';
import { Response } from 'express';

import { catchAsync, generateToken } from '../../../utils';
import { User } from '../../user/models';

import { AuthRequest, LoginByTokenRequestType, LoginRequestType, RegisterUserRequestType } from './types';

export const register = catchAsync(async (req: RegisterUserRequestType, res: Response) => {
  const { email, password, name, stocks } = req.body;

  if (!email || !password || !name || !stocks) {
    throw 'Please enter all fields';
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw 'User already exists';
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    password: hashedPassword,
    name,
    stocks,
  });

  const userRes = await newUser.save();

  const token = generateToken({ id: userRes._id });

  return res
    .status(201)
    .json({ id: userRes._id, name: userRes.name, email: userRes.email, stocks: userRes.stocks, token });
});

export const login = catchAsync(async (req: LoginRequestType, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw 'Invalid credentials';
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw 'Invalid credentials';
  }

  const token = generateToken({ id: user._id });

  return res.status(200).json({
    id: user._id,
    email: user.email,
    name: user.name,
    stocks: user.stocks,
    token,
  });
});

export const loginByToken = catchAsync(async (req: LoginByTokenRequestType, res: Response) => {
  const { user, token } = req;

  if (!user) {
    throw 'token is expired';
  }

  return res.status(200).json({ id: user._id, email: user.email, name: user.name, stocks: user.stocks, token });
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user._id;
  const { name, stocks } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, stocks },
    { new: true }
  );

  if (!updatedUser) {
    throw 'User not found';
  }

  return res.status(200).json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    stocks: updatedUser.stocks
  });
});
