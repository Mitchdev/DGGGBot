exports.commands = {'custom': 'trusted'};
exports.buttons = {};
exports.slashes = [{
  name: 'custom',
  description: 'Custom commands',
  defaultPermission: false,
  options: [{
    name: 'add',
    type: 'SUB_COMMAND',
    description: 'Add a custom command',
    options: [{
      name: 'name',
      type: 'STRING',
      description: 'Name of custom command',
      required: true,
    }, {
      name: 'response',
      type: 'STRING',
      description: 'Response for custom command',
      required: true,
    }],
  }, {
    name: 'remove',
    type: 'SUB_COMMAND',
    description: 'Remove a custom command',
    options: [{
      name: 'name',
      type: 'STRING',
      description: 'Name of custom command',
      required: true,
    }],
  }, {
    name: 'edit',
    type: 'SUB_COMMAND',
    description: 'Edit a custom command',
    options: [{
      name: 'name',
      type: 'STRING',
      description: 'Name of custom command',
      required: true,
    }, {
      name: 'response',
      type: 'STRING',
      description: 'Response for custom command',
      required: true,
    }],
  }, {
    name: 'view',
    type: 'SUB_COMMAND_GROUP',
    description: 'View a custom command',
    options: [{
      name: 'command',
      type: 'SUB_COMMAND',
      description: 'View custom command',
      options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of custom command',
        required: true,
      }],
    }, {
      name: 'list',
      type: 'SUB_COMMAND',
      description: 'View all custom commands',
    }, {
      name: 'attributes',
      type: 'SUB_COMMAND',
      description: 'View possible attributes for a custom command',
    }],
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer({ephemeral: true});
  const customCommandNames = Object.keys(customCommands);
  const type = interaction.options.first();
  if (type.name === 'edit') {
    const found = customCommandNames.find((ccn) => ccn === type.options.get('name').value.toLowerCase().replace(/^!/gi, ''));
    if (found) {
      customCommands[type.options.get('name').value.toLowerCase().replace(/^!/gi, '')].edited.push({
        'old': customCommands[type.options.get('name').value.toLowerCase().replace(/^!/gi, '')].response,
        'new': type.options.get('response').value,
        'userid': interaction.user.id,
        'username': interaction.user.username,
        'date': new Date(),
      });
      customCommands[type.options.get('name').value.toLowerCase().replace(/^!/gi, '')].response = type.options.get('response').value;
    } else interaction.editReply({content: `Could not find ${type.options.get('name').value.replace(/^!/gi, '')}`});
  } else if (type.name === 'add') {
    const found = customCommandNames.find((ccn) => ccn === type.options.get('name').value.toLowerCase().replace(/^!/gi, ''));
    if (!found) {
      if (type.options.get('name').value.indexOf(' ') === -1) {
        if (type.options.get('response').value != '') {
          customCommands[type.options.get('name').value.toLowerCase().replace(/^!/gi, '')] = {
            'name': type.options.get('name').value.toLowerCase().replace(/^!/gi, ''),
            'response': type.options.get('response').value,
            'count': 0,
            'lastUsed': 'never',
            'created': {
              'userid': interaction.user.id,
              'username': interaction.user.username,
              'date': new Date(),
            },
            'edited': [],
          };
          interaction.editReply({content: `${type.options.get('name').value.replace(/^!/gi, '')} ${type.name === 'edit' ? 'edited' : 'added'}`});
          updateCustomCommands();
        } else interaction.editReply({content: 'Response cannot be empty'});
      } else interaction.editReply({content: 'Name cannot have spaces'});
    } else interaction.editReply({content: `${type.options.get('name').value.replace(/^!/gi, '')} already exists`});
  } else if (type.name === 'remove') {
    if (customCommandNames.find((ccn) => ccn === type.options.get('name').value.toLowerCase().replace(/^!/gi, ''))) {
      delete customCommands[type.options.get('name').value.toLowerCase().replace(/^!/gi, '')];
      interaction.editReply({content: `${type.options.get('name').value.replace(/^!/gi, '')} removed`});
      updateCustomCommands();
    } else interaction.editReply({content: `Could not find ${type.options.get('name').value.replace(/^!/gi, '')}`});
  } else if (type.name === 'view') {
    if (type.options.first().name === 'command') {
      if (customCommandNames.find((ccn) => ccn === type.options.first().options.get('name').value.toLowerCase().replace(/^!/gi, ''))) {
        const found = customCommands[type.options.first().options.get('name').value.toLowerCase().replace(/^!/gi, '')];
        const embed = new Discord.MessageEmbed().setTitle('Custom Command');
        const response = await customCommandResponse(found.response);
        embed.addFields([{
          name: 'Name',
          value: found.name,
          inline: true,
        }, {
          name: 'Created by',
          value: found.created.username,
          inline: true,
        }, {
          name: 'Created date',
          value: found.created.date,
          inline: true,
        }, {
          name: 'Use count',
          value: found.count.toString(),
          inline: true,
        }, {
          name: 'Edited count',
          value: found.edited.length.toString(),
          inline: true,
        }, {
          name: 'Last edited',
          value: found.edited.length > 0 ? found.edited[0].date : 'null',
          inline: true,
        }, {
          name: 'Raw Response',
          value: found.response,
        }, {
          name: 'Example Response',
          value: response,
        }]);
        interaction.editReply({embeds: [embed]});
      } else interaction.editReply({content: `Could not find ${type.options.first().options.get('name').value.replace(/^!/gi, '')}`});
    } else if (type.options.first().name === 'list') interaction.editReply({content: `**Custom Commands**\n${customCommandNames.sort().map((ccn) => `${ccn} - ${customCommands[ccn].response.substring(0, 50)}${customCommands[ccn].response.length > 50 ? '...' : ''}`).join('\n')}`});
    else if (type.options.first().name === 'attributes') interaction.editReply({content: `**Custom Command Attributes**\n%RN = Random Number between 0-9`});
  }
};
