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
  "A gentleman is one who is never rude unintentionally. -Noel Coward",
  "A man must destroy himself before others can destroy him. -Mong Tse",
  "A philosopher does not need a torch to gather glow-worms by at mid-day. --Earnest Bramah",
  "I like tofu. --Audrey Felicio Anwar",
  "A woman is only a woman, but a good cigar is a smoke. -Rudyard Kipling",
  "History is a race between education and catastrophe. -H. G. Wells",
  "I am a high-pressure guy, and I didn't take this job to conduct a going-out-of-business sale. - A.A. Penzia",
  "I don't even know what street Canada is on. - Al Capone",
  "All our dreams can come true, if we have the courage to pursue them. —Walt Disney",
  "I’ve missed more than 9,000 shots in my career. I’ve lost almost 300 games. 26 times I’ve been trusted to take the game winning shot and missed. I’ve failed over and over and over again in my life, and that is why I succeed. —Michael Jordan",
  "Don’t limit yourself. Many people limit themselves to what they think they can do. You can go as far as your mind lets you. What you believe, remember, you can achieve. -Mary Kay Ash",
  "You’ve gotta dance like there’s nobody watching, love like you’ll never be hurt, sing like there’s nobody listening, and live like it’s heaven on earth. —William W. Purkey",
  "Smart people learn from everything and everyone, average people from their experiences, stupid people already have all the answers. -Socrates",
  "Whatever you are, be a good one. -Abraham Lincoln",
  "Hold the vision, trust the process. -Radian Krisno",
  "People who wonder if the glass is half empty or full miss the point. The glass is refillable. -Albert Ariel",
  "Every successful person in the world is a hustler one way or another. We all hustle to get where we need to be. Only a fool would sit around and wait on another man to feed him. -K'wan",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. -Aristotle",
  "If you’re offered a seat on a rocket ship, don’t ask what seat! Just get on. -Sheryl Sandberg",
  "Very often, a change of self is needed more than a change of scene. -A.C. Benson",
  "It’s not the load that breaks you down, it’s the way you carry it. -Lou Holtz",
  "You can waste your lives drawing lines. Or you can live your life crossing them. -Shonda Rhimes",
  "I now tried a new hypothesis: It was possible that I was more in charge of my happiness than I was allowing myself to be. -Michelle Obama",
  "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart. -Roy T. Bennett",
  "Work hard in silence, let your success be the noise. -Frank Ocean",
  "If everything seems to be under control, you’re not going fast enough. -Mario Andretti",
  "Opportunity is missed by most people because it is dressed in overalls and looks like work. -Thomas Edison",
  "The best way to appreciate your job is to imagine yourself without one. -Oscar Wilde",
  "Unsuccessful people make their decisions based on their current situations. Successful people make their decisions based on where they want to be. -Benjamin Hardy",
  "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway. -Earl Nithingale",
  "If you cannot do great things, do small things in a great way. -Napoleon Hill",
  "Never allow a person to tell you no who doesn’t have the power to say yes. -Eleanor Roosevelt",
  "At any given moment you have the power to say: this is not how the story is going to end.",
  "Amateus sit around and wait for inspiration. The rest of us just get up and go to work. -Stephen King",
  "Nothing will work unless you do. -Maya Angelou",
  "Sometimes when you’re in a dark place you think you’ve been buried but you’ve actually been planted. -Christine Caine",
  "Everyone has inside them a piece of good news. The good news is you don’t know how great you can be! How much you can love! What you can accomplish! And what your potential is. -Anne Frank",
  "Don’t quit yet, the worst moments are usually followed by the most beautiful silver linings. You have to stay strong, remember to keep your head up and remain hopeful.",
  "When written in Chinese the word “crisis” is composed of two characters―one represents danger and the other represents opportunity. -JFK",
  "Good. Better. Best. Never let it rest. ’Til your good is better and your better is best. -St. Jerome",
  "Start where you are. Use what you have. Do what you can. -Arthur Ashe",
  "Turn your wounds into wisdom. -Oprah Winfrey",
  "Begin anywhere. -John Cage",
  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do. -Pele",
  "Every champion was once a contender that didn’t give up. -Gabby Douglas",
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
