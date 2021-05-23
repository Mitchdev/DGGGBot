exports.name = ['feedcreate', 'feeddelete', 'feedsub', 'feedunsub', 'feedinterval']
exports.permission = 'mod'
exports.slash = [{
    name: 'feedcreate',
    description: 'Creates a new feed in current channel',
	defaultPermission: false
}, {
    name: 'feeddelete',
    description: 'Deletes feed in current channel',
	defaultPermission: false
}, {
    name: 'feedsub',
    description: 'Adds subreddit to feed',
	defaultPermission: false,
    options: [{
        name: 'subreddit',
        type: 'STRING',
        description: 'Subreddit to subscribe to',
        required: true
    }]
}, {
    name: 'feedunsub',
    description: 'Removes subreddit from feed',
	defaultPermission: false,
    options: [{
        name: 'subreddit',
        type: 'STRING',
        description: 'Subreddit to unsubscribe from',
        required: true
    }]
}, {
    name: 'feedinterval',
    description: 'Shows current interval or updates interval',
	defaultPermission: false,
    options: [{
        name: 'interval',
        type: 'INTEGER',
        description: 'How often posts get shown',
        required: false
    }]
}]
exports.handler = function(interaction) {
    var feedIndex = feeds.list.findIndex(feed => feed.channel == interaction.channelID);
	if (feedIndex >= 0) {
		if (interaction.commandName === 'feedsub') {
			request(`https://www.reddit.com/subreddits/search.json?q=${interaction.options[0].value}&nsfw=1&include_over_18=on`, (err, req, res) => {
				var data = JSON.parse(res);
				if (data.data.dist > 0) {
					var filtered = data.data.children.filter(item => {
						return item.data.display_name.toLowerCase() === interaction.options[0].value;
					});
					if (filtered.length > 0) {
						feeds.list[feedIndex].subs.push(interaction.options[0].value);
						interaction.editReply(`Added ${interaction.options[0].value} to the feed.`);
						updateFeed();
					} else interaction.editReply(`Could not find subreddit ${interaction.options[0].value}`);
				} else interaction.editReply(`Could not find subreddit ${interaction.options[0].value}`);
			});
		} else if (interaction.commandName === 'feedunsub') {
			if (feeds.list[feedIndex].subs.includes(interaction.options[0].value)) {
				feeds.list[feedIndex].subs = feeds.list[feedIndex].subs.filter(item => {
					return item !== interaction.options[0].value;
				});
				interaction.editReply(`Removed ${interaction.options[0].value} from the feed.`);
				updateFeed();
			} else interaction.editReply(`Subreddit not in feed.`);
		} else if (interaction.commandName === 'feedinterval') {
			if (interaction.options.length > 0) {
				if (interaction.options[0].value > 10) {
					interaction.editReply(`Updated interval from ${feeds.list[feedIndex].interval} seconds to ${interaction.options[0].value} seconds.`);
					feeds.list[feedIndex].interval = interaction.options[0].value;
					clearInterval(feedTimers[feeds.list[feedIndex].channel]);
					feedTimer(feedIndex);
					updateFeed();
				} else interaction.editReply(`Interval has to be more than 10 seconds.`);
			} else interaction.editReply(`The current feed interval is ${feeds.list[feedIndex].interval} seconds.`);
		} else if (interaction.commandName === 'feeddelete') {
			clearInterval(feedTimers[feeds.list[feedIndex].channel]);
			feeds.list.splice(feedIndex, 1);
			updateFeed();
			interaction.editReply(`Deleted feed for this channel`);
		}
	} else {
		if (interaction.commandName === 'feedcreate') {
			feeds.list.push({"interval": 3600, "channel": interaction.channelID, "subs": [], "posted": []});
			interaction.editReply(`Created a new feed for this channel`);
			updateFeed();
		} else {
			interaction.editReply(`No feed in this channel`);
		}
	}
}