exports.commands = {'roles': 'mod'};
exports.buttons = {'autoroles': 'none'};
exports.slashes = [{
  name: 'roles',
  description: 'Roles Command',
  defaultPermission: false,
  options: [{
    name: 'reload',
    description: 'Reloads roles channel message',
    type: 'SUB_COMMAND',
  }, {
    name: 'remove',
    description: 'Removes a role from the roles channel',
    type: 'SUB_COMMAND',
    options: [{
      name: 'name',
      type: 'STRING',
      description: 'Name of role to remove',
      required: true,
    }],
  }, {
    name: 'add',
    description: 'Adds a role to the roles channel',
    type: 'SUB_COMMAND',
    options: [{
      name: 'category',
      type: 'STRING',
      description: 'Category you want to role to appear in',
      required: true,
      choices: [{
        name: 'General',
        value: 'General',
      }, {
        name: 'Gaming',
        value: 'Gaming',
      }],
    }, {
      name: 'name',
      type: 'STRING',
      description: 'Name of role',
      required: true,
    }, {
      name: 'role',
      type: 'ROLE',
      description: 'Role that gets added when doing the reaction',
      required: true,
    }, {
      name: 'emoji',
      type: 'STRING',
      description: 'Emoji for reaction',
      required: true,
    }, {
      name: 'position',
      type: 'INTEGER',
      description: 'Position in category',
      required: false,
    }],
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer({ephemeral: true});

  console.log(interaction);
  if (interaction.options.first().name === 'reload') {
    interaction.editReply({content: `Reloaded`, ephemeral: true});
    reloadRolesMessage(Discord);
  } else if (interaction.options.first().name === 'remove') {
    roles.list = roles.list.filter((role) => role.name.toLowerCase() != interaction.options.first().options.get('name').value.toLowerCase());
    interaction.editReply({content: `Removed ${interaction.options.first().options.get('name').value}`, ephemeral: true});
    reloadRolesMessage(Discord);
    updateRoles();
  } else if (interaction.options.first().name === 'add') {
    const role = {
      'name': interaction.options.first().options.get('name').value,
      'type': interaction.options.first().options.get('category').value,
      'role': interaction.options.first().options.get('role').value,
      'reaction': {'type': '', 'name': '', 'id': ''},
    };

    const emojiMatch = interaction.options.first().options.get('emoji').value.match(/\<\:(.+?)\:(\d+?)\>/g);
    const unicodeEmojiMatch = interaction.options.first().options.get('emoji').value.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
    if (emojiMatch != undefined) {
      const emoji = client.emojis.cache.find((emoji) => emoji.id == emojiMatch[0].split(':')[2].replace('>', ''));
      if (emoji != undefined) {
        role.reaction.type = 'custom';
        role.reaction.name = emoji.name;
        role.reaction.id = emoji.id;
      } else {
        interaction.editReply({content: 'Invalid emoji, guild or unicode emoji only', ephemeral: true});
        return;
      }
    } else if (unicodeEmojiMatch != undefined) {
      role.reaction.type = 'unicode';
      role.reaction.name = unicodeEmojiMatch[0];
      role.reaction.id = unicodeEmojiMatch[0];
    } else {
      interaction.editReply({content: 'Invalid emoji, guild or unicode emoji only', ephemeral: true});
      return;
    }

    const alreadyUsed = roles.list.filter((r) => (r.reaction.id == role.reaction.id || r.name.toLowerCase() == role.name.toLowerCase()));
    if (alreadyUsed.length > 0) {
      if (alreadyUsed.reaction.id == role.reaction.id) interaction.editReply({content: 'Role reaction already exists', ephemeral: true});
      else interaction.editReply({content: 'Role name already exists', ephemeral: true});
      return;
    }

    addRole(role, interaction.options.first().options.get('position')?.value, interaction, Discord);
  }
};
exports.buttonHandler = async function(interaction) {
  await interaction.defer({ephemeral: true});

  const foundRole = roles.list.find((role) => role.name === interaction.customId.split('|')[1]);
  if (foundRole) {
    interaction.member.guild.roles.fetch(foundRole.role).then((role) => {
      if (interaction.member._roles.includes(foundRole.role)) {
        interaction.member.roles.remove(role);
        interaction.editReply({content: `${foundRole.name} role removed`, ephemeral: true});
      } else {
        interaction.member.roles.add(role);
        interaction.editReply({content: `${foundRole.name} role added`, ephemeral: true});
      }
    }).catch(console.error);
  }
};
