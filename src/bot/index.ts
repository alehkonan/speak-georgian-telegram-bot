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
      const user = await User.findOne({ userId: from.id });

      if (user) {
        console.log(`User ${user.id} found in database`);
        console.log('user: ', JSON.stringify(user));
        console.log('word in history: ', JSON.stringify(translationInHistory));
        const matchWord = user.history.find(
          ({ wordId }) => wordId === translationInHistory.id
        );
        if (matchWord) {
          console.log(`Word ${matchWord} found in User`);
          await user.updateOne({
            $inc: { 'history.$.requested': 1 },
          });
        } else {
          console.log(`Word ${translationInHistory.from} not found in User`);
          await user.updateOne({
            $push: { history: { wordId: translationInHistory.id } },
          });
        }
      } else {
        console.log(`User ${from.id} not found in database. Creating new user`);
        await User.create({
          userId: from.id,
          history: [{ word: translationInHistory }],
        });
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
          { $push: { history: { wordId: newHistory.id } } },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    ctx.reply((error as Error).message);
  }
});
