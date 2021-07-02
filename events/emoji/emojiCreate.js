module.exports = function(client) {
  client.on('emojiCreate', (emoji) => {
    if (!emoji.animated) {
      fs.writeFileSync('./options/emotesBackup.json', JSON.stringify(emotesUse));
      emotesUse.newStarted = new Date();
      for (const emote in emotesUse.emotes) {
        if (emotesUse.emotes[emote].newUses) {
          emotesUse.emotes[emote].newUses = 0;
        }
      }
      updateEmoteUse();
    }
  });
};
