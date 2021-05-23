module.exports = function(client) {
  updatePins = function() {
    fs.writeFileSync('./options/pins.json', JSON.stringify(pins));
  };
};
