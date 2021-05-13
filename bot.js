const { Client, Intents } = require('discord.js');
const fs = require('fs');
const client = new Client({'messageCacheMaxSize': 1000, 'fetchAllMembers': true, 'intents': [Intents.ALL]});

var config = require('./options/options.json');
var commands = [];

client.on('ready', () => {
	config['disabled'] = false;

    require('./globals')({client: client, config: config, commands: commands});
    require('./init')(commands);

    loadCommands(client);
    loadEvents(client);
    loadFunctions(client);

	client.channels.resolve(options.channel.roles).messages.fetch(options.message.roles);

	client.guilds.fetch(options.guild).then(guild => {
		guild.fetchInvites().then(invites => {
			invites.each(invite => {
				inviteList.push(invite);
			});
		});

        for (var i = 0; i < feeds.list.length; i++) {
            feedTimers[feeds.list[i].channel] = setTimeout(function() {
                reloadFeed(feeds.list[i].channel)
            }, feeds.list[i].interval * 1000);
        }
        
		setInterval(function() {
			for (var i = 0; i < mutes.list.length; i++) {
				checkRemoveTag(guild, mutes.list[i]);
			}
		}, 5000);
	}).catch(console.error);

	console.log('Online!');
	client.users.fetch(options.user.mitch).then(mitch => {mitch.send(`Bot restarted!`)});
});

client.login(config.token);