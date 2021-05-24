module.exports = function(commands) {
  loadCommands = function(client) {
    commands = [];
    try {
      client.guilds.fetch(options.guild).then((guild) => {
        const dir = dpath.resolve(__dirname, './commands') + '/';
        fs.readdirSync(dir).forEach(function(file) {
          if (file.indexOf('.js') > -1) {
            const command = reload(dir + file);
            commands.push(command);
            if (command.slash) {
              for (let i = 0; i < command.slash.length; i++) {
                if (command.permission === 'mod') {
                  guild.commands.create(command.slash[i]).then((cmd) => {
                    cmd.setPermissions([{
                      id: '773110638000078888',
                      type: 'ROLE',
                      permission: true,
                    }]);
                  }).catch(console.log);
                } else {
                  client.application.commands.create(command.slash[i]).catch(console.log);
                }
              }
            }
          }
        });
        reloadGlobals(client);
        console.log('[INIT] ' + commands.length + ' Commands loaded...');
      });
    } catch (e) {
      console.error('Unable to load command: ', e.stack);
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
      console.log('[INIT] ' + events + ' Events loaded...');
    } catch (e) {
      console.error('Unable to load event: ', e.stack);
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
      console.log('[INIT] ' + functions + ' Functions loaded...');
    } catch (e) {
      console.error('Unable to load function: ', e.stack);
    }
  };
  reloadGlobals = function(client) {
    reload('./globals')({client: client, config: options, commands: commands});
  };
};
