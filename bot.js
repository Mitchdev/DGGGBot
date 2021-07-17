require('dotenv').config();
const {Client, Intents} = require('discord.js');
const client = new Client({
  'intents': [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});

const config = require('./options/options.json');
const commands = [];

client.on('ready', async () => {
  await require('./globals')({client: client, config: config, commands: commands});
  await require('./init')(commands);
  await loadEvents(client);
  await loadFunctions(client);
  await loadCommands(client);

  const guild = await client.guilds.resolve(process.env.GUILD_ID);
  await guild.channels.cache.each(async (channel) => {
    if (channel.isText()) {
      const invites = await guild.invites.fetch({channelId: channel.id});
      invites.each((invite) => inviteList.push(invite));
    }
  });

  for (let i = 0; i < feeds.list.length; i++) feedTimer(i);

  setInterval(() => {
    for (let i = 0; i < mutes.list.length; i++) checkRemoveTag(guild, mutes.list[i]);
  }, 5000);

  const devLog = await client.users.resolve(process.env.DEV_ID);
  const errMsg = await devLog.send('**Restart** Latest Error:');
  const errorLog = fs.readFileSync(dpath.join(__srcdir, '../../.pm2/logs/bot-error.log'), {encoding: 'utf8'}).split('\n');
  const errorTimestamp = errorLog[errorLog.length-2].match(/(\d\d\d\d\-\d\d\-\d\d\T\d\d\:\d\d\:)/g);
  if (errorTimestamp) {
    const lastestError = errorLog.filter((line) => line.startsWith(errorTimestamp[0])).join('\n');
    splitMessage(null, lastestError, 'js', errMsg);
  }
  const outMsg = await devLog.send('**Restart** Latest Out:');
  const outLog = fs.readFileSync(dpath.join(__srcdir, '../../.pm2/logs/bot-out.log'), {encoding: 'utf8'}).split('\n');
  const outTimestamp = outLog[outLog.length-2].match(/(\d\d\d\d\-\d\d\-\d\d\T\d\d\:\d\d\:)/g);
  if (outTimestamp) {
    const lastestOut = outLog.filter((line) => line.startsWith(outTimestamp[0])).join('\n');
    splitMessage(null, lastestOut, 'js', outMsg);
  }

  console.log('[INIT] Bot Online');
});

client.login(process.env.BOT_TOKEN);
