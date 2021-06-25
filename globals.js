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
  triviaToken = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/triviaToken.json'))).token;
  triviaCategory = {
    '9': 'General Knowledge',
    '10': 'Books',
    '11': 'Film',
    '12': 'Music',
    '13': 'Musicals & Theatres',
    '14': 'Television',
    '15': 'Video Games',
    '16': 'Board Games',
    '17': 'Science & Nature',
    '18': 'Computers',
    '19': 'Mathematics',
    '20': 'Mythology',
    '21': 'Sports',
    '23': 'History',
    '22': 'Geography',
    '24': 'Politics',
    '25': 'Art',
    '26': 'Celebrities',
    '27': 'Animals',
    '28': 'Vehicles',
    '29': 'Comics',
    '30': 'Gadgets',
    '31': 'Japanese Anime & Manga',
    '32': 'Cartoon & Animations',
  };

  client = conf.client;
  options = conf.config;
  commands = conf.commands;

  colorNames = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/colorNames.json')));

  roles = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/roles.json')));
  pins = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/pins.json')));
  feeds = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/feeds.json')));
  mutes = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/mutes.json')));
  emotesUse = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/emotes.json')));
  measurements = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/measurements.json')));
  languageCodes = JSON.parse(fs.readFileSync(dpath.join(__dirname, './options/lang.json')));
};
