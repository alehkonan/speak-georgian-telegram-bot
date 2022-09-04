import mongoose from 'mongoose';
import { database } from '../database/index.js';
import { History } from './History.js';

type UserType = {
  userId: number;
  history: {
    wordId: string;
    requested?: number;
  }[];
};

const userSchema = new database.Schema<UserType>({
  userId: { type: Number, required: true },
  history: [
    {
      wordId: { type: mongoose.Types.ObjectId, ref: History },
      requested: { type: Number, default: 1 },
    },
  ],
});

export const User = database.model<UserType>('User', userSchema);
