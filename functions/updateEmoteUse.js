module.exports = function(client) {
  updateEmoteUse = function() {
    fs.writeFileSync(dpath.join(__dirname, '../options/emotes.json'), JSON.stringify(emotesUse));
  };
};
