import { Telegraf } from 'telegraf';
import { history } from '../services/history.js';
import { translateText } from '../services/translator.js';
import { detectLanguage } from '../utils/detectLanguage.js';

const token = process.env.TELEGRAM_API_TOKEN as string;

export const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name}!`);
  ctx.reply(
    'Here you can translate any phrase to georgian language. Just send your message'
  );
});

bot.on('text', async (ctx) => {
  const { text } = ctx.message;
  const lang = detectLanguage(text);
  if (!lang) {
    ctx.reply('I don`t support this language');
    return;
  }
  const result = await history.find(text);
  if (result?.to) {
    ctx.reply(result?.to);
  } else {
    const translation = await translateText(text, { from: lang, to: 'ka' });
    if (translation) {
      ctx.reply(translation);
      history.write(text, translation);
    }
  }
});
