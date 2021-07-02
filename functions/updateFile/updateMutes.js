module.exports = function(client) {
  updateMutes = function() {
    fs.writeFileSync(dpath.join(__srcdir, './options/mutes.json'), JSON.stringify(mutes));
  };
};
