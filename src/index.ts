import 'dotenv/config';
import { Telegraf } from 'telegraf';

const token = process.env.TELEGRAM_API_TOKEN as string;

const bot = new Telegraf(token);

bot.launch().then(() => console.log('bot started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
