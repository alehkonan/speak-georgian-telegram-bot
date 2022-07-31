import mongoose from 'mongoose';
import { database } from '../database/index.js';
import { History, HistoryType } from './History.js';

type UserType = {
  userId: number;
  history: HistoryType[];
};

const userSchema = new database.Schema<UserType>({
  userId: { type: Number, required: true },
  history: { type: [mongoose.Types.ObjectId], ref: History },
});

export const User = database.model<UserType>('User', userSchema);
