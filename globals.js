module.exports = function(conf) {
  fs = require('fs');
  dpath = require('path');
  reload = require('require-reload')(require);
  request = require('request');
  os = require('os');
  cloneDeep = require('lodash.clonedeep');
  htmlEntities = require('html-entities');
  colorThief = require('color-thief-node');

  currentVoteID = null;
  voteValidReactions = [];
  inviteList = [];
  gunCooldown = false;
  feedTimers = {};
  recentReactions = [];

  gambleDuels = {};

  connect4Games = {};
  tictactoeGames = {};
  minesweeperGames = {};
  scrabbleGames = {};

  triviaQueue = [];
  triviaGame = null;
  triviaLeaderboard = [];
  triviaOptions = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/trivia.json')));
  triviaGPT2 = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/gpt2Trivia.json')));

  client = conf.client;
  options = conf.config;
  commands = conf.commands;

  colorNames = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/colorNames.json')));
  customCommands = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/customCommands.json')));
  roles = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/roles.json')));
  pins = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/pins.json')));
  feeds = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/feeds.json')));
  mutes = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/mutes.json')));
  emotesUse = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/emotes.json')));
  measurements = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/measurements.json')));
  languageCodes = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/lang.json')));
};
