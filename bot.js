const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({'messageCacheMaxSize': 1000, 'fetchAllMembers': true});

var config = require('./options/options.json');
var commands = [];

client.on('ready', () => {
	config['disabled'] = false;

    require('./globals')({client: client, config: config, commands: commands});
    require('./init')(commands);

    loadCommands(client);
    loadEvents(client);
    loadFunctions(client);

	console.log('Online!');
	
	client.channels.resolve(options.channel.roles).messages.fetch(options.message.roles);

	client.users.fetch(options.user.mitch).then(mitch => {
		mitch.send(`Bot restarted!`);
	});

	client.guilds.fetch(options.guild).then(guild => {
		setInterval(function() {
			for (var i = 0; i < mutes.list.length; i++) {
				checkRemoveTag(guild, mutes.list[i]);
			}
		}, 5000);
	}).catch(console.error);
});

client.login(config.token);