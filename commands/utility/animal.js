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
exports.commandHandler = async function(interaction) {
  await interaction.deferReply();

  const animalCode = {'ferret': 'Ferret', 'dog': 'Dog', 'cat': 'Cat', 'panda': 'Panda', 'red_panda': 'Red Panda', 'fox': 'Fox', 'koala': 'Koala', 'birb': 'Bird', 'racoon': 'Racoon', 'kangaroo': 'Kangaroo', 'elephant': 'Elepant', 'giraffe': 'Giraffe', 'whale': 'Whale'};
  const animalPics = ['ferret', 'dog', 'cat', 'panda', 'red_panda', 'fox', 'koala', 'birb', 'racoon', 'kangaroo', 'whale'];
  const animalFacts = ['dog', 'cat', 'panda', 'fox', 'koala', 'birb', 'racoon', 'kangaroo', 'elephant', 'giraffe', 'whale'];
  let animal = interaction.options.get('animal').value;

  if (interaction.options.getSubcommand() === 'pic') {
    if (animal === 'random') animal = animalPics[Math.floor(Math.random() * animalPics.length)];
    const {url, link} = await (await fetch(animal === 'ferret' ? process.env.ANIMAL_PIC_FERRET_API : process.env.ANIMAL_PIC_OTHER_API.replace('|animal|', animal))).json();
    if (url || link) interaction.editReply({content: `**${animalCode[animal]}**\n${animal === 'ferret' ? url : link}`});
    else interaction.editReply({content: `Could not get pic of ${animalCode[animal]}`});
  } else {
    if (animal === 'random') animal = animalFacts[Math.floor(Math.random() * animalFacts.length)];
    const {fact} = await (await fetch(process.env.ANIMAL_FACT_OTHER_API.replace('|animal|', animal))).json();
    if (fact) interaction.editReply({content: `**${animalCode[animal]}**\n${fact}`});
    else interaction.editReply({content: `Could not get fact of ${animalCode[animal]}`});
  }
};
