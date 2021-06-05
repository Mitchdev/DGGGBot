module.exports = function(client) {
  updateFeed = function() {
    fs.writeFileSync(dpath.join(__dirname, '../options/feeds.json'), JSON.stringify(feeds));
  };
};
