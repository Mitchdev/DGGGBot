module.exports = function(commands) {
  loadCommands = function(client) {
    commands = [];
    try {
      client.guilds.fetch(options.guild).then((guild) => {
        let globalCommands = 0;
        let guildCommands = 0;
        const dir = dpath.resolve(__dirname, './commands') + '/';
        fs.readdirSync(dir).forEach(function(file) {
          if (file.indexOf('.js') > -1) {
            const command = reload(dir + file);
            commands.push(command);
            for (let i = 0; i < command.slashes.length; i++) {
              if (command.commands[command.slashes[i].name] === 'none') {
                globalCommands++;
                client.application.commands.create(command.slashes[i]).catch(console.log);
              } else {
                guildCommands++;
                guild.commands.create(command.slashes[i]).then((cmd) => {
                  if (command.commands[command.slashes[i].name] === 'mod') {
                    cmd.setPermissions([{
                      id: '773110638000078888',
                      type: 'ROLE',
                      permission: true,
                    }]);
                  } else if (command.commands[command.slashes[i].name] === 'weeb/wizard') {
                    cmd.setPermissions([{
                      id: '788077328948789298',
                      type: 'ROLE',
                      permission: true,
                    }, {
                      id: '787807791192080394',
                      type: 'ROLE',
                      permission: true,
                    }]);
                  } else if (command.commands[command.slashes[i].name] === 'mitch') {
                    cmd.setPermissions([{
                      id: '399186129288560651',
                      type: 'USER',
                      permission: true,
                    }]);
                  }
                }).catch(console.log);
              }
            }
          }
        });
        reloadGlobals(client);
        console.log(`[${new Date().toUTCString()}][INIT] ${globalCommands} Global commands loaded`);
        console.log(`[${new Date().toUTCString()}][INIT] ${guildCommands} Guild commands loaded`);
      });
    } catch (e) {
      console.error(`[${new Date().toUTCString()}][INIT] Unable to load command: `, e.stack);
    }
  };
  loadEvents = function(client) {
    try {
      let events = 0;
      const dir = dpath.resolve(__dirname, './events') + '/';
      fs.readdirSync(dir).forEach(function(file) {
        if (file.indexOf('.js') > -1) {
          reload(dir + file)(client);
          events++;
        }
      });
      console.log(`[${new Date().toUTCString()}][INIT] ${events} Events loaded`);
    } catch (e) {
      console.error(`[${new Date().toUTCString()}][INIT] Unable to load event: `, e.stack);
    }
  };
  loadFunctions = function(client) {
    try {
      let functions = 0;
      const dir = dpath.resolve(__dirname, './functions') + '/';
      fs.readdirSync(dir).forEach(function(file) {
        if (file.indexOf('.js') > -1) {
          reload(dir + file)(client);
          functions++;
        }
      });
      console.log(`[${new Date().toUTCString()}][INIT] ${functions} Functions loaded`);
    } catch (e) {
      console.error(`[${new Date().toUTCString()}][INIT] Unable to load function: `, e.stack);
    }
  };
  reloadGlobals = function(client) {
    reload('./globals')({client: client, config: options, commands: commands});
  };
};
