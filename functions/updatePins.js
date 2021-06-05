module.exports = function(client) {
  updatePins = function() {
    fs.writeFileSync(dpath.join(__dirname, '../options/pins.json'), JSON.stringify(pins));
  };
};
