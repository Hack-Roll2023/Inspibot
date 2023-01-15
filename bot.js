const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const BOT_TOKEN = '5879315038:AAFlbnICx1tR51ZTLjNciaNOd-qFe4Hq9Yk';
const MAIN_CHANNEL_CHAT_ID = '@beinspiredeveryday';
const bot = new Telegraf(BOT_TOKEN);
const GREETING = 
`Hi! Are you ready to be inspired everyday? Type /inspire to start getting motivated!
For full list of available commands, type /list`;

const COMMANDS = {
  list: "Lists all available commands",
  start: "Kick start your journey to get inspired!",
  subscribe: "Schedule your inspiration to be sent",
  inspire: "Get inspired by getting a quote"
};

const QUOTES_BANK = [
  "Life is about making an impact, not making an income. -Kevin Kruse",
  "Whatever the mind of man can conceive and believe, it can achieve. –Napoleon Hill",
  "Strive not to be a success, but rather to be of value. –Albert Einstein",
  "Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.  –Robert Frost",
  "I attribute my success to this: I never gave or took any excuse. –Florence Nightingale",
  "You miss 100% of the shots you don’t take. –Wayne Gretzky",
  "I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed. –Michael Jordan",
  "The most difficult thing is the decision to act, the rest is merely tenacity. –Amelia Earhart",
  "Every strike brings me closer to the next home run. –Babe Ruth",
  "Definiteness of purpose is the starting point of all achievement. –W. Clement Stone",
  "Life isn't about getting and having, it's about giving and being. –Kevin Kruse",
  "Life is what happens to you while you’re busy making other plans. –John Lennon",
  "We become what we think about. –Earl Nightingale",
  "Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do, so throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails.  Explore, Dream, Discover. –Mark Twain",
  "Life is 10% what happens to me and 90% of how I react to it. –Charles Swindoll",
  "The most common way people give up their power is by thinking they don’t have any. –Alice Walker",
  "The mind is everything. What you think you become.  –Buddha",
  "The best time to plant a tree was 20 years ago. The second best time is now. –Chinese Proverb",
  "An unexamined life is not worth living. –Socrates",
  "Eighty percent of success is showing up. –Woody Allen",
  "Your time is limited, so don’t waste it living someone else’s life. –Steve Jobs",
  "Winning isn’t everything, but wanting to win is. –Vince Lombardi",
  "I am not a product of my circumstances. I am a product of my decisions. –Stephen Covey",
  "Every child is an artist.  The problem is how to remain an artist once he grows up. –Pablo Picasso",
  "You can never cross the ocean until you have the courage to lose sight of the shore. –Christopher Columbus",
];

let subscribers = {}

subscribers[MAIN_CHANNEL_CHAT_ID] = 
  cron.schedule("*/1 * * * *", () => {
    const index = Math.floor(Math.random() * (QUOTES_BANK.length + 1));
    bot.telegram.sendMessage(MAIN_CHANNEL_CHAT_ID, QUOTES_BANK[index]);
  });

bot.start(ctx => ctx.reply(GREETING));

bot.command('subscribe', (ctx) => {
  const index = Math.floor(Math.random() * (QUOTES_BANK.length + 1));
  const text = ctx.message.text.split(' ');
  const id = "" + ctx.chat.id;
  if (text.length == 1) {
    ctx.sendMessage("Please specify the interval you wish to be inspired\n/subscribe <seconds> <minutes> <hours>");
    return;
  }
  text[text.length - 1] = "*/" + text[text.length - 1];
  const cronDesc = text.slice(1).reduce((x, y) => x + ' ' + y) + ' ' + Array(7 - text.length).fill("*").reduce((x, y) => x + ' ' + y);
  
  if (cron.validate(cronDesc)) {
    if (id in subscribers) {
      subscribers[id].stop();
      delete subscribers[id];
    }
    console.log(cronDesc);
    ctx.sendMessage("Interval received, begin motivating!");
    ctx.sendMessage(QUOTES_BANK[Math.floor(Math.random() * (QUOTES_BANK.length + 1))]);
    subscribers[id] = 
      cron.schedule(cronDesc, () => {
        const index = Math.floor(Math.random() * (QUOTES_BANK.length + 1));
        bot.telegram.sendMessage(id, QUOTES_BANK[index]);
      });
    console.log(subscribers);
    return;
  }
  ctx.sendMessage("Interval not recognized. Please make sure seconds is between 0 - 59, minutes is between 0 - 59, hours is between 0 - 23");
});

bot.command('unsubscribe', (ctx) => {
  const id = "" + ctx.chat.id;
  if (!(id in subscribers)) {
    ctx.sendMessage("You are not subsribed yet :(");
    return;
  }
  subscribers[id].stop();
  delete subscribers[id];
});

bot.command('inspire', (ctx) => {
  const index = Math.floor(Math.random() * (QUOTES_BANK.length + 1));
  ctx.reply(QUOTES_BANK[index]);
});

bot.command('list', (ctx) => {
  let reply = "";
  for (const [command, description] of Object.entries(COMMANDS)) {
    reply += "/" + command + " " + description + "\n";
  }
  ctx.reply(reply);
});

// Launch bot
bot.launch();

// Enable graceful stop
const cleanCron = () => {
  for (const [id, task] of subscribers) {
    delete subscribers[id];
  }
}

process.once('SIGINT', () => {
  cleanCron();
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  cleanCron();
  bot.stop('SIGTERM')
});
