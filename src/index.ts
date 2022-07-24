import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { history } from './services/history.js';
import { translateText } from './services/translator.js';

const token = process.env.TELEGRAM_API_TOKEN as string;

const bot = new Telegraf(token);

bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  const cachedResult = await history.find(text);
  if (cachedResult) {
    ctx.reply(cachedResult);
    return;
  }
  const result = await translateText(text, { from: 'en', to: 'ka' });
  if (result) {
    ctx.reply(result);
    history.write(text, result);
  }
});

bot.launch().then(() => console.log('bot has been started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
