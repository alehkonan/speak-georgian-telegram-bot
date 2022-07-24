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
    const file = await readFile(fileUrl);
    const historyJson = JSON.parse(file.toString()) as History;
    return historyJson.records.find((record) => record.from === text)?.to;
  },
  write: async (from: string, to: string) => {
    const file = await readFile(fileUrl);
    const historyJson = JSON.parse(file.toString());
    historyJson.records.push({ from, to });
    await writeFile(fileUrl, JSON.stringify(historyJson));
    console.log(historyJson);
  },
};
