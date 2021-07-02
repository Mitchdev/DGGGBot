module.exports = function(client) {
  updateEmoteUse = function() {
    fs.writeFileSync(dpath.join(__srcdir, './options/emotes.json'), JSON.stringify(emotesUse));
  };
};
