import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { history } from './services/history.js';
import { translateText } from './services/translator.js';

const token = process.env.TELEGRAM_API_TOKEN as string;

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name}!`);
  ctx.reply(
    'Here you can translate any phrase to georgian language. Just send your message'
  );
  ctx.reply('To stop bot send /quit');
  ctx.reply('For help send /help');
});

bot.command('/quit', (ctx) => ctx.leaveChat());

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});

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
