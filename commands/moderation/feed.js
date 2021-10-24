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
      name: 'seconds',
      type: 'INTEGER',
      description: 'How often posts get shown in seconds',
      required: false,
    }],
  }],
}];
exports.commandHandler = async function(interaction) {
  await interaction.deferReply();

  const feedIndex = feeds.list.findIndex((feed) => feed.channel == interaction.channelId);
  if (feedIndex >= 0) {
    if (interaction.options.getSubcommand() === 'list') {
      if (feedIndex >= 0) interaction.editReply({content: `**Subs in the feed**\n${feeds.list[feedIndex].subs.join('\n')}`});
      else interaction.editReply({content: `No feed in this channel`});
    } else if (interaction.options.getSubcommand() === 'sub') {
      const data = await (await fetch(process.env.SUBREDDIT_SEARCH_API.replace('|subreddit|', interaction.options.get('subreddit').value))).json();
      if (data.data.dist > 0) {
        const filtered = data.data.children.filter((item) => {
          return item.data.display_name.toLowerCase() === interaction.options.get('subreddit').value;
        });
        if (filtered.length > 0) {
          feeds.list[feedIndex].subs.push(interaction.options.get('subreddit').value);
          interaction.editReply({content: `Added ${interaction.options.get('subreddit').value} to the feed.`});
          updateFeed();
        } else interaction.editReply({content: `Could not find subreddit ${interaction.options.get('subreddit').value}`});
      } else interaction.editReply({content: `Could not find subreddit ${interaction.options.get('subreddit').value}`});
    } else if (interaction.options.getSubcommand() === 'unsub') {
      if (feeds.list[feedIndex].subs.includes(interaction.options.get('subreddit').value)) {
        feeds.list[feedIndex].subs = feeds.list[feedIndex].subs.filter((item) => {
          return item !== interaction.options.get('subreddit').value;
        });
        interaction.editReply({content: `Removed ${interaction.options.get('subreddit').value} from the feed.`});
        updateFeed();
      } else interaction.editReply({content: 'Subreddit not in feed.'});
    } else if (interaction.options.getSubcommand() === 'interval') {
      if (interaction.options.get('seconds')) {
        if (interaction.options.get('seconds').value > 10) {
          interaction.editReply({content: `Updated interval from ${feeds.list[feedIndex].interval} seconds to ${interaction.options.get('seconds').value} seconds.`});
          feeds.list[feedIndex].interval = interaction.options.get('seconds').value;
          clearInterval(feedTimers[feeds.list[feedIndex].channel]);
          feedTimer(feedIndex);
          updateFeed();
        } else interaction.editReply({content: `Interval has to be more than 10 seconds.`});
      } else interaction.editReply({content: `The current feed interval is ${feeds.list[feedIndex].interval} seconds.`});
    } else if (interaction.options.getSubcommand() === 'delete') {
      clearInterval(feedTimers[feeds.list[feedIndex].channel]);
      feeds.list.splice(feedIndex, 1);
      updateFeed();
      interaction.editReply({content: `Deleted feed for this channel`});
    }
  } else {
    if (interaction.options.getSubcommand() === 'create') {
      feeds.list.push({'interval': 3600, 'channel': interaction.channelId, 'subs': [], 'posted': []});
      interaction.editReply({content: `Created a new feed for this channel`});
      updateFeed();
    } else {
      interaction.editReply({content: `No feed in this channel`});
    }
  }
};
