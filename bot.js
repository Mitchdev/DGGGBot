const {Client, Intents} = require('discord.js');
// const fs = require('fs');
const client = new Client({'messageCacheMaxSize': 1000, 'fetchAllMembers': true, 'intents': [Intents.ALL]});

const config = require('./options/options.json');
const commands = [];

client.on('ready', () => {
  require('./globals')({client: client, config: config, commands: commands});
  require('./init')(commands);

  loadCommands(client);
  loadEvents(client);
  loadFunctions(client);

  client.channels.resolve(options.channel.roles).messages.fetch(options.message.roles);

  client.guilds.fetch(options.guild).then((guild) => {
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

  console.log('Online!');
  client.users.fetch(options.user.mitch).then((mitch) => {
    mitch.send(`Bot restarted!`);
  });
});

client.login(config.token);
