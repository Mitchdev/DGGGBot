module.exports = function(client) {
  updateCustomCommands = function() {
    fs.writeFileSync(dpath.join(__dirname, '../options/customCommands.json'), JSON.stringify(customCommands));
  };
};
