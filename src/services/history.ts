import { readFile, writeFile } from 'fs/promises';

const fileUrl = new URL('../../data/history.json', import.meta.url);

type Record = {
  from: string;
  to: string;
};

type History = {
  records: Record[];
};

export const history = {
  find: async (text: string) => {
    try {
      const file = await readFile(fileUrl);
      const historyJson = JSON.parse(file.toString()) as History;
      return historyJson.records.find((record) => record.from === text)?.to;
    } catch (error) {
      console.error(error);
    }
  },
  write: async (from: string, to: string) => {
    try {
      const file = await readFile(fileUrl);
      const historyJson = JSON.parse(file.toString());
      historyJson.records.push({ from, to });
      await writeFile(fileUrl, JSON.stringify(historyJson));
    } catch (error) {
      console.error(error);
    }
  },
};
