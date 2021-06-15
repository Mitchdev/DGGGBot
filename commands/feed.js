exports.commands = {'feed': 'mod'};
exports.buttons = {};
exports.slashes = [{
  name: 'feed',
  description: 'Feed commands',
  defaultPermission: false,
  options: [{
    name: 'list',
    description: 'Lists all the subs in the feed of the current channel',
    type: 'SUB_COMMAND',
  }, {
    name: 'create',
    description: 'Creates a new feed in the current channel',
    type: 'SUB_COMMAND',
  }, {
    name: 'delete',
    description: 'Deletes the feed in the current channel',
    type: 'SUB_COMMAND',
  }, {
    name: 'sub',
    description: 'Adds subreddit to feed in the current channel',
    type: 'SUB_COMMAND',
    options: [{
      name: 'subreddit',
      type: 'STRING',
      description: 'Subreddit to subscribe to',
      required: true,
    }],
  }, {
    name: 'unsub',
    description: 'Removes subreddit from the feed in the current channel',
    type: 'SUB_COMMAND',
    options: [{
      name: 'subreddit',
      type: 'STRING',
      description: 'Subreddit to unsubscribe from',
      required: true,
    }],
  }, {
    name: 'interval',
    description: 'Shows current interval or updates the interval for the feed in the current channel',
    type: 'SUB_COMMAND',
    options: [{
      name: 'interval',
      type: 'INTEGER',
      description: 'How often posts get shown in seconds',
      required: false,
    }],
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const command = interaction.options.first();
  const feedIndex = feeds.list.findIndex((feed) => feed.channel == interaction.channelID);
  if (feedIndex >= 0) {
    if (command.name === 'list') {
      if (feedIndex >= 0) interaction.editReply({content: `**Subs in the feed**\n${feeds.list[feedIndex].subs.join('\n')}`});
      else interaction.editReply({content: `No feed in this channel`});
    } else if (command.name === 'sub') {
      request(`https://www.reddit.com/subreddits/search.json?q=${command.options.get('subreddit').value}&nsfw=1&include_over_18=on`, (err, req, res) => {
        const data = JSON.parse(res);
        if (data.data.dist > 0) {
          const filtered = data.data.children.filter((item) => {
            return item.data.display_name.toLowerCase() === command.options.get('subreddit').value;
          });
          if (filtered.length > 0) {
            feeds.list[feedIndex].subs.push(command.options.get('subreddit').value);
            interaction.editReply({content: `Added ${command.options.get('subreddit').value} to the feed.`});
            updateFeed();
          } else interaction.editReply({content: `Could not find subreddit ${command.options.get('subreddit').value}`});
        } else interaction.editReply({content: `Could not find subreddit ${command.options.get('subreddit').value}`});
      });
    } else if (command.name === 'unsub') {
      if (feeds.list[feedIndex].subs.includes(command.options.get('subreddit').value)) {
        feeds.list[feedIndex].subs = feeds.list[feedIndex].subs.filter((item) => {
          return item !== command.options.get('subreddit').value;
        });
        interaction.editReply(`Removed ${command.options.get('subreddit').value} from the feed.`);
        updateFeed();
      } else interaction.editReply(`Subreddit not in feed.`);
    } else if (command.name === 'interval') {
      if (command.options.length > 0) {
        if (command.options.get('interval').value > 10) {
          interaction.editReply({content: `Updated interval from ${feeds.list[feedIndex].interval} seconds to ${command.options.get('interval').value} seconds.`});
          feeds.list[feedIndex].interval = command.options.get('interval').value;
          clearInterval(feedTimers[feeds.list[feedIndex].channel]);
          feedTimer(feedIndex);
          updateFeed();
        } else interaction.editReply({content: `Interval has to be more than 10 seconds.`});
      } else interaction.editReply({content: `The current feed interval is ${feeds.list[feedIndex].interval} seconds.`});
    } else if (command.name === 'delete') {
      clearInterval(feedTimers[feeds.list[feedIndex].channel]);
      feeds.list.splice(feedIndex, 1);
      updateFeed();
      interaction.editReply({content: `Deleted feed for this channel`});
    }
  } else {
    if (command.name === 'create') {
      feeds.list.push({'interval': 3600, 'channel': interaction.channelID, 'subs': [], 'posted': []});
      interaction.editReply({content: `Created a new feed for this channel`});
      updateFeed();
    } else {
      interaction.editReply({content: `No feed in this channel`});
    }
  }
};
