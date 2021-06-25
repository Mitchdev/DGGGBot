module.exports = function(commands) {
  loadCommands = function(client, callback) {
    commands = [];
    try {
      client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
        const dir = dpath.resolve(__dirname, './commands') + '/';
        fs.readdirSync(dir).forEach(function(file) {
          if (file.indexOf('.js') > -1) {
            const command = reload(dir + file);
            commands.push(command);
          }
        });
        reloadGlobals(client);
        console.log(`[INIT] ${commands.length} Commands loaded`);
        callback(true);
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
