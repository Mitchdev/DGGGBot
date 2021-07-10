module.exports = function(client) {
  updateSuggestions = function() {
    fs.writeFileSync(dpath.join(__srcdir, './options/suggestions.json'), JSON.stringify(suggestions));
  };
};
