require('dotenv').config();
const {Client, Intents} = require('discord.js');
const client = new Client({'messageCacheMaxSize': 1000, 'fetchAllMembers': true, 'intents': [Intents.ALL]});

const config = require('./options/options.json');
const commands = [];

client.on('ready', () => {
  require('./globals')({client: client, config: config, commands: commands});
  require('./init')(commands);

  loadEvents(client);
  loadFunctions(client);
  loadCommands(client, () => {
    // reloadSlashCommands();
  });

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

  console.log(`[INIT] Bot online`);
  client.users.fetch(process.env.DEV_ID).then((devLog) => {
    devLog.send({content: 'Bot restarted!'});
    const errorLog = fs.readFileSync(dpath.join(__dirname, '../../.pm2/logs/bot-error.log'), {encoding: 'utf8'});
    const errorLogArray = errorLog.split('\n');
    const timestamp = errorLogArray[errorLogArray.length-2].match(/(\d\d\d\d\-\d\d\-\d\d\T\d\d\:\d\d\:\d\d\:)/g);
    if (timestamp) {
      const lastestError = errorLogArray.filter((line) => line.startsWith(timestamp[0])).join('\n');
      devLog.send({content: 'Latest Error:'});
      devLog.send({content: lastestError, code: 'xl', split: true});
    }
  });
});

client.login(process.env.BOT_TOKEN);
