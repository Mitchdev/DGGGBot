exports.name = ['animal'];
exports.permission = 'none';
exports.slash = [{
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
        value: 'fox',
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
exports.handler = function(interaction) {
  const animalPics = ['ferret', 'dog', 'cat', 'panda', 'red_panda', 'fox', 'koala', 'birb', 'racoon', 'kangaroo', 'whale'];
  const animalFacts = ['dog', 'cat', 'panda', 'fox', 'koala', 'birb', 'racoon', 'kangaroo', 'elephant', 'giraffe', 'whale'];
  let animal = interaction.options[0].options[0].value;
  if (interaction.options[0].name === 'pic') {
    if (animal === 'random') animal = animalPics[Math.floor(Math.random() * animalPics.length)];
    if (animal === 'ferret') {
      request(options.api.animal.pic.ferret, (err, req, res) => {
        if (!err) interaction.editReply(JSON.parse(res).url);
      });
    } else {
      request(options.api.animal.pic.other + animal, (err, req, res) => {
        if (!err) interaction.editReply(JSON.parse(res).link);
      });
    }
  } else {
    if (animal === 'random') animal = animalFacts[Math.floor(Math.random() * animalFacts.length)];
    request(options.api.animal.fact.other + animal, (err, req, res) => {
      if (!err) interaction.editReply(JSON.parse(res).fact);
    });
  }
};
