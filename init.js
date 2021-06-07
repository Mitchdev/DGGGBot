module.exports = function(commands) {
  reloadCommands = function(client) {
    commands = [];
    const dir = dpath.resolve(__dirname, './commands') + '/';
    fs.readdirSync(dir).forEach(function(file) {
      if (file.indexOf('.js') > -1) {
        const command = reload(dir + file);
        commands.push(command);
      }
    });
    reloadGlobals(client);
    console.log(`[INIT] Command handlers reloaded`);
  };
  loadCommands = function(client) {
    commands = [];
    try {
      client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
        let userCommands = 0;
        let modCommands = 0;
        let roleCommands = 0;
        let devCommands = 0;
        const dir = dpath.resolve(__dirname, './commands') + '/';
        fs.readdirSync(dir).forEach(function(file) {
          if (file.indexOf('.js') > -1) {
            const command = reload(dir + file);
            commands.push(command);
            for (let i = 0; i < command.slashes.length; i++) {
              if (command.commands[command.slashes[i].name] === 'none') {
                userCommands++;
                client.application.commands.create(command.slashes[i]).then((cmd) => {
                  console.log(`[INIT] Command loaded ${cmd.name}`);
                }).catch(console.log);
              } else if (command.commands[command.slashes[i].name] === 'mod') {
                modCommands++;
                guild.commands.create(command.slashes[i]).then((cmd) => {
                  cmd.setPermissions([{
                    id: '773110638000078888',
                    type: 'ROLE',
                    permission: true,
                  }]);
                  console.log(`[INIT] Command loaded ${cmd.name}`);
                }).catch(console.log);
              } else if (command.commands[command.slashes[i].name] === 'weeb/wizard') {
                roleCommands++;
                guild.commands.create(command.slashes[i]).then((cmd) => {
                  cmd.setPermissions([{
                    id: '788077328948789298',
                    type: 'ROLE',
                    permission: true,
                  }, {
                    id: '787807791192080394',
                    type: 'ROLE',
                    permission: true,
                  }]);
                  console.log(`[INIT] Command loaded ${cmd.name}`);
                }).catch(console.log);
              } else if (command.commands[command.slashes[i].name] === 'dev') {
                devCommands++;
                client.application.commands.create(command.slashes[i]).then((cmd) => {
                  console.log(`[INIT] Command loaded ${cmd.name}`);
                }).catch(console.log);
              } else {
                console.log(`<==== INVALID_CMD ====>`);
                console.log(command);
                console.log(`<==== INVALID_CMD END ====>`);
              }
            }
          }
        });
        reloadGlobals(client);
        console.log(`[INIT] ${userCommands} User base commands loading`);
        console.log(`[INIT] ${modCommands} Mod base commands loading`);
        console.log(`[INIT] ${roleCommands} Role base commands loading`);
        console.log(`[INIT] ${devCommands} Dev base commands loading`);
      });
    } catch (e) {
      console.error(`[INIT] Unable to load command: `, e.stack);
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
      console.log(`[INIT] ${events} Events loaded`);
    } catch (e) {
      console.error(`[INIT] Unable to load event: `, e.stack);
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
      console.log(`[INIT] ${functions} Functions loaded`);
    } catch (e) {
      console.error(`[INIT] Unable to load function: `, e.stack);
    }
  };
  reloadGlobals = function(client) {
    reload('./globals')({client: client, config: options, commands: commands});
  };
};
