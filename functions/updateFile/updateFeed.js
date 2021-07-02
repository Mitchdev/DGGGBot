module.exports = function(client) {
  updateFeed = function() {
    fs.writeFileSync(dpath.join(__srcdir, './options/feeds.json'), JSON.stringify(feeds));
  };
};
