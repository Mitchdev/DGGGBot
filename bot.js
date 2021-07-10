require('dotenv').config();
const {Client, Intents, Util} = require('discord.js');
const client = new Client({'messageCacheMaxSize': 1000, 'fetchAllMembers': true, 'intents': [Intents.ALL]});

const config = require('./options/options.json');
const commands = [];

client.on('ready', async () => {
  await require('./globals')({client: client, config: config, commands: commands});
  await require('./init')(commands);
  await loadEvents(client);
  await loadFunctions(client);
  await loadCommands(client);

  client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
    guild.fetchInvites().then((invites) => {
      invites.each((invite) => {
        inviteList.push(invite);
      });
    });

    for (let i = 0; i < feeds.list.length; i++) feedTimer(i);

    setInterval(function() {
      for (let i = 0; i < mutes.list.length; i++) {
        checkRemoveTag(guild, mutes.list[i]);
      }
    }, 5000);
  }).catch(console.error);

  console.log('[INIT] Bot Online');
  client.users.fetch(process.env.DEV_ID).then((devLog) => {
    const errorLog = fs.readFileSync(dpath.join(__srcdir, '../../.pm2/logs/bot-error.log'), {encoding: 'utf8'}).split('\n');
    const errorTimestamp = errorLog[errorLog.length-2].match(/(\d\d\d\d\-\d\d\-\d\d\T\d\d\:\d\d\:)/g);
    if (errorTimestamp) {
      const lastestError = errorLog.filter((line) => line.startsWith(errorTimestamp[0])).join('\n');
      devLog.send({content: '**Restart** Latest Error:'});
      const errSplit = Util.splitMessage(lastestError);
      for (let i = 0; i < errSplit.length; i++) devLog.send({content: `\`\`\`js\n${errSplit[i]}\`\`\``});
    }

    const outLog = fs.readFileSync(dpath.join(__srcdir, '../../.pm2/logs/bot-out.log'), {encoding: 'utf8'}).split('\n');
    const outTimestamp = outLog[outLog.length-2].match(/(\d\d\d\d\-\d\d\-\d\d\T\d\d\:\d\d\:)/g);
    if (outTimestamp) {
      const lastestOut = outLog.filter((line) => line.startsWith(outTimestamp[0])).join('\n');
      devLog.send({content: '**Restart** Latest Out:'});
      const outSplit = Util.splitMessage(lastestOut);
      for (let i = 0; i < outSplit.length; i++) devLog.send({content: `\`\`\`js\n${outSplit[i]}\`\`\``});
    }
  });
});

client.login(process.env.BOT_TOKEN);
