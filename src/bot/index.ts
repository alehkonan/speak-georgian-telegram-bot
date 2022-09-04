import { Telegraf } from 'telegraf';
import { History } from '../models/History.js';
import { User } from '../models/User.js';
import { translateText } from '../api/translator.js';
import { detectLanguage } from '../utils/detectLanguage.js';

const token = process.env.TELEGRAM_API_TOKEN as string;
const georgianLang = 'ka';

export const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name}!`);
  ctx.reply(
    'Here you can translate any phrase to georgian language. Just send your message'
  );
});

bot.on('text', async (ctx) => {
  try {
    const { text, from } = ctx.message;
    const detectedLang = detectLanguage(text);

    if (!detectedLang) {
      ctx.reply('I don`t support this language');
      return;
    }

    const translationInHistory = await History.findOneAndUpdate(
      { from: text },
      { $inc: { requested: 1 } }
    );

    if (translationInHistory) {
      await ctx.reply(translationInHistory?.to);
      const word = await User.findOneAndUpdate(
        { userId: from.id, 'history.word': translationInHistory },
        { $inc: { 'history.$.requested': 1 } }
      );

      if (!word) {
        await User.updateOne(
          { userId: from.id },
          { $push: { history: { word: translationInHistory } } },
          { upsert: true }
        );
      }
    } else {
      const { translation, errorMessage } = await translateText(text, {
        from: detectedLang,
        to: georgianLang,
      });

      if (errorMessage) {
        ctx.reply(errorMessage);
        return;
      }

      if (translation) {
        await ctx.reply(translation);
        const newHistory = await History.create({
          from: text,
          to: translation,
        });
        await User.updateOne(
          { userId: from.id },
          { $push: { history: { word: newHistory } } },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    ctx.reply((error as Error).message);
  }
});
