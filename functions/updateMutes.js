module.exports = function(client) {
  updateMutes = function() {
    fs.writeFileSync(dpath.join(__dirname, '../options/mutes.json'), JSON.stringify(mutes));
  };
};
