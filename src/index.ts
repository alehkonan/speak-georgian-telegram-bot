import 'dotenv/config';
import { bot } from './bot/index.js';

await bot.launch();
console.log('bot has been started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
