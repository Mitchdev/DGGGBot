module.exports = function(client) {
  updateCustomCommands = function() {
    fs.writeFileSync(dpath.join(__srcdir, './options/customCommands.json'), JSON.stringify(customCommands));
  };
};
