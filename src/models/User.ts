import mongoose from 'mongoose';
import { database } from '../database/index.js';
import { History, HistoryType } from './History.js';

type UserType = {
  userId: number;
  history: {
    word: HistoryType;
    requested: number;
  }[];
};

const userSchema = new database.Schema<UserType>({
  userId: { type: Number, required: true },
  history: [
    {
      word: { type: [mongoose.Types.ObjectId], ref: History },
      requested: { type: Number, default: 1 },
    },
  ],
});

export const User = database.model<UserType>('User', userSchema);
