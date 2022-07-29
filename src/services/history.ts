import { History } from '../models/History.js';

export const history = {
  find: async (text: string) => {
    try {
      const result = await History.findOne({ from: text });
      return result;
    } catch (error) {
      console.error(error);
    }
  },
  write: async (from: string, to: string) => {
    try {
      History.create({ from, to });
    } catch (error) {
      console.error(error);
    }
  },
};
