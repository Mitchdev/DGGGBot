exports.commands = {'animal': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'animal',
  description: 'Animal command',
  options: [{
    name: 'pic',
    description: 'Gets random animal picture',
    type: 'SUB_COMMAND',
    options: [{
      name: 'animal',
      type: 'STRING',
      description: 'Type of animal',
      required: true,
      choices: [{
        name: 'Random',
        value: 'random',
      }, {
        name: 'Ferret',
        value: 'ferret',
      }, {
        name: 'Dog',
        value: 'dog',
      }, {
        name: 'Cat',
        value: 'cat',
      }, {
        name: 'Panda',
        value: 'panda',
      }, {
        name: 'Red Panda',
        value: 'red_panda',
      }, {
        name: 'Fox',
        value: 'fox',
      }, {
        name: 'Koala',
        value: 'koala',
      }, {
        name: 'Bird',
        value: 'birb',
      }, {
        name: 'Racoon',
        value: 'racoon',
      }, {
        name: 'Kangaroo',
        value: 'kangaroo',
      }, {
        name: 'Whale',
        value: 'whale',
      }],
    }],
  }, {
    name: 'fact',
    description: 'Gets random animal fact',
    type: 'SUB_COMMAND',
    options: [{
      name: 'animal',
      type: 'STRING',
      description: 'Type of animal',
      required: true,
      choices: [{
        name: 'Random',
        value: 'random',
      }, {
        name: 'Dog',
        value: 'dog',
      }, {
        name: 'Cat',
        value: 'cat',
      }, {
        name: 'Panda',
        value: 'panda',
      }, {
        name: 'Fox',
        value: 'fox',
      }, {
        name: 'Koala',
        value: 'koala',
      }, {
        name: 'Bird',
        value: 'birb',
      }, {
        name: 'Racoon',
        value: 'racoon',
      }, {
        name: 'Kangaroo',
        value: 'kangaroo',
      }, {
        name: 'Elephant',
        value: 'elephant',
      }, {
        name: 'Giraffe',
        value: 'giraffe',
      }, {
        name: 'Whale',
        value: 'whale',
      }],
    }],
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const animalCode = {'dog': 'Dog', 'cat': 'Cat', 'panda': 'Panda', 'red_panda': 'Red Panda', 'fox': 'Fox', 'koala': 'Koala', 'birb': 'Bird', 'racoon': 'Racoon', 'kangaroo': 'Kangaroo', 'elephant': 'Elepant', 'giraffe': 'Giraffe', 'whale': 'Whale'}
  const animalPics = ['ferret', 'dog', 'cat', 'panda', 'red_panda', 'fox', 'koala', 'birb', 'racoon', 'kangaroo', 'whale'];
  const animalFacts = ['dog', 'cat', 'panda', 'fox', 'koala', 'birb', 'racoon', 'kangaroo', 'elephant', 'giraffe', 'whale'];
  let animal = interaction.options.first().options.first().value;
  if (interaction.options.first().name === 'pic') {
    if (animal === 'random') animal = animalPics[Math.floor(Math.random() * animalPics.length)];
    if (animal === 'ferret') {
      request(options.api.animal.pic.ferret, (err, req, res) => {
        if (!err) interaction.editReply(`**Ferret**\n${JSON.parse(res).url}`);
      });
    } else {
      request(options.api.animal.pic.other + animal, (err, req, res) => {
        if (!err) interaction.editReply(`**${animalCode[animal]}**\n${JSON.parse(res).link}`);
      });
    }
  } else {
    if (animal === 'random') animal = animalFacts[Math.floor(Math.random() * animalFacts.length)];
    request(options.api.animal.fact.other + animal, (err, req, res) => {
      if (!err) interaction.editReply(`**${animalCode[animal]}**\n${JSON.parse(res).fact}`);
    });
  }
};
