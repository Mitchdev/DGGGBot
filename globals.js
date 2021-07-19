module.exports = function(conf) {
  fs = require('fs');
  dpath = require('path');
  reload = require('require-reload')(require);
  fetch = require('node-fetch');
  sharp = require('sharp');
  os = require('os');
  cloneDeep = require('lodash.clonedeep');
  htmlEntities = require('html-entities');
  colorThief = require('color-thief-node');

  __srcdir = __dirname;

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
  triviaOptions = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/trivia.json')));
  triviaGPT2 = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/gpt2Trivia.json')));

  client = conf.client;
  options = conf.config;
  commands = conf.commands;

  countries = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/countries.json')));
  suggestions = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/suggestions.json')));
  colorNames = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/colorNames.json')));
  roles = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/roles.json')));
  pins = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/pins.json')));
  feeds = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/feeds.json')));
  mutes = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/mutes.json')));
  emotesUse = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/emotes.json')));
  measurements = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/measurements.json')));
  languageCodes = JSON.parse(fs.readFileSync(dpath.join(__srcdir, './options/lang.json')));
};
