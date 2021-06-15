module.exports = function(conf) {
  fs = require('fs');
  dpath = require('path');
  reload = require('require-reload')(require);
  request = require('request');
  os = require('os');
  cloneDeep = require('lodash.clonedeep');
  htmlEntities = require('html-entities');


  currentVoteID = null;
  voteValidReactions = [];
  inviteList = [];
  gunCooldown = false;
  feedTimers = {};
  recentReactions = [];
  gambleDuels = {};
  connect4Games = {};
  tictactoeGames = {};
  scrabbleGames = {};

  triviaGames = {};
  triviaToken = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/triviaToken.json'))).token;

  client = conf.client;
  options = conf.config;
  commands = conf.commands;

  roles = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/roles.json')));
  pins = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/pins.json')));
  feeds = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/feeds.json')));
  mutes = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/mutes.json')));
  emotesUse = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/emotes.json')));
  measurements = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/measurements.json')));
  languageCodes = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/lang.json')));
};
