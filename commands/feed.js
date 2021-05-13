exports.name = ['feed']
exports.permission = 'mod'
exports.handler = function(message) {
    var feedIndex = feeds.list.findIndex(feed => feed.channel == message.channel.id);
    if (feedIndex >= 0) {
        var args = message.content.toLowerCase().split(' ');
        if (args.length > 1) {
            if (args[1] == "list" || args[1] == "subs") {
                message.channel.send(`**Subs in the feed**\n${feeds.list[feedIndex].subs.join('\n')}`);
            } else if (args[1] == "sub") {
                if (args.length > 2) {
                    request(`https://www.reddit.com/subreddits/search.json?q=${args[2]}&nsfw=1&include_over_18=on`, (err, req, res) => {
                        var data = JSON.parse(res);
                        if (data.data.dist > 0) {
                            var filtered = data.data.children.filter(item => {
                                return item.data.display_name.toLowerCase() === args[2];
                            });
                            if (filtered.length > 0) {
                                feeds.list[feedIndex].subs.push(args[2]);
                                message.channel.send(`Added ${args[2]} to the feed.`);
                                updateFeed();
                            } else {
                                message.channel.send(`Could not find subreddit ${args[2]}`);
                            }
                        } else {
                            message.channel.send(`Could not find subreddit ${args[2]}`);
                        }
                    });
                } else {
                    message.channel.send(`Missing a subreddit.`);
                }
            } else if (args[1] == "unsub") {
                if (args.length > 2) {
                    if (feeds.list[feedIndex].subs.includes(args[2])) {
                        feeds.list[feedIndex].subs = feeds.list[feedIndex].subs.filter(item => {
                            return item !== args[2];
                        });
                        message.channel.send(`Removed ${args[2]} from the feed.`);
                        updateFeed();
                    } else {
                        message.channel.send(`Subreddit not in feed.`);
                    }
                } else {
                    message.channel.send(`Missing a subreddit.`);
                }
            } else if (args[1] == "interval") {
                if (args.length > 2) {
                    if (parseInt(args[2])) {
                        if (parseInt(args[2]) > 10) {
                            message.channel.send(`Updated interval from ${feeds.list[feedIndex].interval} seconds to ${args[2]} seconds.`);
                            feeds.list[feedIndex].interval = parseInt(args[2]);
                            clearInterval(feedTimers[feeds.list[feedIndex].channel]);
                            feedTimers[feeds.list[feedIndex].channel] = setInterval(function() {
                                reloadFeed(feeds.list[feedIndex].channel);
                            }, feeds.list[feedIndex].interval * 1000);
                            updateFeed();
                        } else {
                            message.channel.send(`Interval has to be more than 10 seconds.`);
                        }
                    } else {
                        message.channel.send(`The feed interval can only be a number.`);
                    }
                } else {
                    message.channel.send(`The current feed interval is ${feeds.list[feedIndex].interval} seconds.`);
                }
            }
        }
    }
}