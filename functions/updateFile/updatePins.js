module.exports = function(client) {
  updatePins = function() {
    fs.writeFileSync(dpath.join(__srcdir, './options/pins.json'), JSON.stringify(pins));
  };
};
