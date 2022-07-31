import axios from 'axios';
import * as Axios from 'axios';
import { TranslatorResponse } from '../types';

type Options = {
  from: 'ru' | 'en';
  to: 'ka';
};

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY as string;

const translatorApi = axios.create({
  baseURL: process.env.GOOGLE_TRANSLATE_API_URL,
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'application/gzip',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
  },
});

export const translateText = async (text: string, { from, to }: Options) => {
  const encodedParams = new URLSearchParams();
  encodedParams.append('q', text);
  encodedParams.append('source', from);
  encodedParams.append('target', to);

  try {
    const { data } = await translatorApi.post<TranslatorResponse>(
      '/language/translate/v2',
      encodedParams
    );

    return {
      translation: data.data?.translations
        .map((text) => text.translatedText)
        .join(','),
      errorMessage: data.error?.message,
    };
  } catch (error) {
    let errorMessage = 'Can`t translate this word, please try again later';
    const { response } = (error as Axios.AxiosError) || {};
    if (response?.status === 429)
      errorMessage =
        'Monthly quota has been exceeded, but you can translate words, that have been already translated by other users';

    return {
      translation: undefined,
      errorMessage,
    };
  }
};
