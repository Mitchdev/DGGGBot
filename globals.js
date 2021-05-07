module.exports = function(conf) {
	fs = require('fs');
	os = require('os');
	request = require('request');
	dpath = require('path');
	reload = require('require-reload')(require);

	currentVoteID = null;
	voteValidReactions = [];
	inviteList = [];
	gunCooldown = false;
	timedout = false;

	client = conf.client;
	options = conf.config;
	commands = conf.commands;

	roles = JSON.parse(fs.readFileSync('./options/roles.json'));
	pins = JSON.parse(fs.readFileSync('./options/pins.json'));
	mutes = JSON.parse(fs.readFileSync('./options/mutes.json'));
	emotesUse = JSON.parse(fs.readFileSync('./options/emotes.json'));
	languageCodes = JSON.parse(fs.readFileSync('./options/lang.json'));
}