import axios from 'axios';
import { TranslatorResponse } from '../types';

type Options = {
  from: 'ru' | 'en';
  to: 'ka';
};

const apiUrl = process.env.GOOGLE_TRANSLATE_API_URL as string;
const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY as string;

export const translateText = async (text: string, { from, to }: Options) => {
  console.log('request to the server');
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.append('q', text);
    encodedParams.append('source', from);
    encodedParams.append('target', to);

    const { data } = await axios.post<TranslatorResponse>(
      apiUrl,
      encodedParams,
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
        },
      }
    );
    if (data.error) throw new Error('Can`t translate this message');
    return data.data?.translations
      .map((translation) => translation.translatedText)
      .join(',');
  } catch (error) {
    return (error as Error).message;
  }
};
