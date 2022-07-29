import { database } from '../database/index.js';

type HistoryRecord = {
  from: string;
  to: string;
};

const historySchema = new database.Schema<HistoryRecord>({
  from: { type: String, required: true, lowercase: true, trim: true },
  to: { type: String, required: true, lowercase: true, trim: true },
});

export const History = database.model<HistoryRecord>('History', historySchema);
