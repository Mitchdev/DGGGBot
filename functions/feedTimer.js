module.exports = function(client) {
	feedTimer = function(i) {
        feedTimers[feeds.list[i].channel] = setInterval(function() {
            reloadFeed(feeds.list[i].channel)
        }, feeds.list[i].interval * 1000);
	}
}