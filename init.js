module.exports = function(commands) {
    loadCommands = function(client) {
        commands = [];
        try {
            client.guilds.fetch(options.guild).then(guild => {
                var dir = dpath.resolve(__dirname, './commands') + '/';
                fs.readdirSync(dir).forEach(function (file) {
                    if (file.indexOf(".js") > -1) {
                        var command = reload(dir + file);
                        commands.push(command);
                        if (command.slash) {
                            guild.commands.create(command.slash).then(cmd => {
                                if (command.permission === 'mod') {
                                    cmd.setPermissions([{
                                        id: '773110638000078888',
                                        type: 'ROLE',
                                        permission: true
                                    }]);
                                }
                            });
                        }
                    }
                });
                reloadGlobals(client);
                console.log("[INIT] " + commands.length + " Commands loaded...");
            });
        } catch (e) {
            console.error('Unable to load command: ', e.stack);
        }
    }
    loadEvents = function(client) {
        try {
            var events = 0;
            var dir = dpath.resolve(__dirname, './events') + '/';
            fs.readdirSync(dir).forEach(function (file) {
                if (file.indexOf(".js") > -1) {
                    reload(dir + file)(client);
                    events++;
                }
            });
            console.log("[INIT] " + events + " Events loaded...");
        } catch (e) {
            console.error('Unable to load event: ', e.stack);
        }
    }
    loadFunctions = function(client) {
        try {
            var functions = 0;
            var dir = dpath.resolve(__dirname, './functions') + '/';
            fs.readdirSync(dir).forEach(function (file) {
                if (file.indexOf(".js") > -1) {
                    reload(dir + file)(client);
                    functions++;
                }
            });
            console.log("[INIT] " + functions + " Functions loaded...");
        } catch (e) {
            console.error('Unable to load function: ', e.stack);
        }
    }
    reloadGlobals = function(client) {
        reload('./globals')({client: client, config: options, commands: commands});
    }
}