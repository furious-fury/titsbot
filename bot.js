require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { generateRandomNumber } = require('./utils');
const { getUserScore, updateUserScore, getLeaderboard, checkCooldown } = require('./storage');
const { getRandomMessage, getRandomCooldownMessage } = require('./messages');

// Track handled commands to prevent double responses
const handledCommands = new Set();

// Replace 'YOUR_BOT_TOKEN' with your actual bot token from BotFather
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Command definitions
const commands = [
  { command: 'start', description: 'Start the bot' },
  { command: 'help', description: 'Show available commands' },
  { command: 'hello', description: 'Get a greeting' },
  { command: 'growtits', description: 'Grow your tits! (Once per minute)' },
  { command: 'leaderboard', description: 'Show the tits leaderboard' }
];

// Register bot commands
async function setupCommands() {
  try {
    await bot.setMyCommands(commands);
    console.log('Commands registered successfully!');
  } catch (error) {
    console.error('Error setting commands:', error.message);
  }
}

// Initialize commands
setupCommands();

// Handle /start command
bot.onText(/\/start(@\w+)?$/, (msg) => {
  handledCommands.add(msg.message_id);
  console.log(`Processing /start command from ${msg.from.first_name} (${msg.from.id})`);
  const chatId = msg.chat.id;
  const username = msg.from.first_name;
  bot.sendMessage(chatId, `Welcome ${username}! 👋\nUse /help to see available commands.`);
});

// Handle /help command
bot.onText(/\/help(@\w+)?$/, (msg) => {
  handledCommands.add(msg.message_id);
  console.log(`Processing /help command from ${msg.from.first_name} (${msg.from.id})`);
  const chatId = msg.chat.id;
  const helpText = commands
    .map(cmd => `/${cmd.command} - ${cmd.description}`)
    .join('\n');
  bot.sendMessage(chatId, `Available commands:\n${helpText}`);
});

// Handle /hello command
bot.onText(/\/hello(@\w+)?$/, (msg) => {
  handledCommands.add(msg.message_id);
  console.log(`Processing /hello command from ${msg.from.first_name} (${msg.from.id})`);
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Hi there! 👋 ${msg.from.first_name}`);
});

// Handle /growtits command
bot.onText(/\/growtits(@\w+)?$/, (msg) => {
  handledCommands.add(msg.message_id);
  console.log(`Processing /growtits command from ${msg.from.first_name} (${msg.from.id})`);
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.first_name;

  // Check if command is used in a group
  if (msg.chat.type === 'private') {
    bot.sendMessage(chatId, '❌ The /growtits command can only be used in groups!');
    return;
  }

  // Check cooldown
  const remainingTime = checkCooldown(chatId, userId);
  if (remainingTime > 0) {
    bot.sendMessage(chatId, getRandomCooldownMessage(remainingTime));
    return;
  }

  const growth = generateRandomNumber();
  const newTotal = updateUserScore(chatId, userId, username, growth);
  
  // Get cup size based on total size
  const { getCupSize } = require('./messages');
  const cupSize = getCupSize(newTotal);
  
  // Get a random message and possibly a GIF based on growth and cup size
  const { message, gif } = getRandomMessage(growth, cupSize);
  
  // If we have a GIF, send it with the message as caption
  if (gif) {
    bot.sendAnimation(chatId, gif, { caption: message, parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
});

// Handle /leaderboard command
bot.onText(/\/leaderboard(@\w+)?$/, async (msg) => {
  handledCommands.add(msg.message_id);
  console.log(`Processing /leaderboard command from ${msg.from.first_name} (${msg.from.id})`);
  const chatId = msg.chat.id;

  // Check if command is used in a group
  if (msg.chat.type === 'private') {
    bot.sendMessage(chatId, '❌ The /leaderboard command can only be used in groups!');
    return;
  }
  
  const leaderboard = getLeaderboard(chatId);
  if (leaderboard.length === 0) {
    bot.sendMessage(chatId, '📊 No growth records in this group yet! Use /growtits to start growing!');
    return;
  }

  const leaderboardText = await Promise.all(leaderboard.slice(0, 10).map(async ([userId, score], index) => {
    try {
      const chatMember = await bot.getChatMember(chatId, userId);
      const username = chatMember.user.first_name;
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖';
      return `${medal} ${username}: ${score} cm`;
    } catch (error) {
      return `${index + 1}. User${userId}: ${score} cm`;
    }
  }));

  const message = `📊 *Top Growers in this group:*\n\n${leaderboardText.join('\n')}`;
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Handle unknown commands
bot.on('message', (msg) => {
  if (!msg.text || !msg.text.startsWith('/')) return;
  if (handledCommands.has(msg.message_id)) return;

  // Only respond to unknown commands
  const command = msg.text.split(' ')[0].split('@')[0];
  if (!commands.some(cmd => `/${cmd.command}` === command)) {
    bot.sendMessage(msg.chat.id, 'Unknown command. Use /help to see available commands.');
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Unknown command. Use /help to see available commands.');
  }
  
  // Clean up old message IDs periodically (every 100 messages)
  if (handledCommands.size > 100) {
    handledCommands.clear();
  }
});
