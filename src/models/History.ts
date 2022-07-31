import { database } from '../database/index.js';

export type HistoryType = {
  from: string;
  to: string;
  requested?: number;
};

const historySchema = new database.Schema<HistoryType>({
  from: { type: String, required: true, lowercase: true, trim: true },
  to: { type: String, required: true, lowercase: true, trim: true },
  requested: { type: Number, default: 1 },
});

export const History = database.model<HistoryType>('History', historySchema);
