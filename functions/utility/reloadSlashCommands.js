module.exports = function(client) {
  reloadSlashCommands = async function(c, clientCommands = []) {
    let guildCmdCount = 0;
    let commandsSplit = c;
    let cmds = 0;

    if (!commandsSplit) commandsSplit = commands.map((_, i) => commands.slice(i * 5, (i + 1) * 5)).filter((arr) => arr.length > 0);

    if (commandsSplit.length > 0) {
      commandsSplit[0].forEach(async (command) => {
        if (command.slashes.length === 0) {
          console.log(`<==== INVALID_CMD ====>\n`, command, `\n<==== INVALID_CMD END ====>`);
          next();
        }
        for (let i = 0; i < command.slashes.length; i++) {
          if (command.commands[command.slashes[i].name] === 'none' || command.commands[command.slashes[i].name] === 'dev') {
            clientCommands.push(command.slashes[i]);
            next();
          } else if (command.commands[command.slashes[i].name] === 'trusted') {
            const cmd = await client.guilds.resolve(process.env.GUILD_ID).commands.create(command.slashes[i]);
            cmd.permissions.set({permissions: [
              {id: process.env.ROLE_MOD, type: 'ROLE', permission: true},
              {id: process.env.ROLE_TRUSTED, type: 'ROLE', permission: true},
            ]});
            next(cmd);
          } else if (command.commands[command.slashes[i].name] === 'mod') {
            const cmd = await client.guilds.resolve(process.env.GUILD_ID).commands.create(command.slashes[i]);
            cmd.permissions.set({permissions: [{id: process.env.ROLE_MOD, type: 'ROLE', permission: true}]});
            next(cmd);
          } else if (command.commands[command.slashes[i].name] === 'weeb/wizard') {
            const cmd = await client.guilds.resolve(process.env.GUILD_ID).commands.create(command.slashes[i]);
            cmd.permissions.set({permissions: [
              {id: process.env.ROLE_WEEB, type: 'ROLE', permission: true},
              {id: process.env.ROLE_WIZARD, type: 'ROLE', permission: true},
            ]});
            next(cmd);
          } else {
            console.log(`<==== INVALID_CMD ====>\n`, command, `\n<==== INVALID_CMD END ====>`);
            next();
          }
        }
      });
    } else {
      const cmd = await client.application.commands.set(clientCommands);
      console.log(cmd.map((sc) => `[INIT] Command loaded ${sc.name}`).join('\n'));
    }

    /**
     * Hults adding guild commands for ratelimit.
     * @param {object} cmd command object
     */
    function next(cmd) {
      cmds++;
      if (cmd) {
        guildCmdCount++;
        console.log(`[INIT] Command loaded ${cmd.name}`);
      }
      if (cmds === commandsSplit[0]?.length) {
        setTimeout(() => {
          commandsSplit.splice(0, 1);
          reloadSlashCommands(commandsSplit, clientCommands);
        }, 6500*guildCmdCount);
      }
    }
  };
};
