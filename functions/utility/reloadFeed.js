module.exports = function(client) {
  reloadFeed = function(channel) {
    const feedIndex = feeds.list.findIndex((feed) => feed.channel == channel);
    if (feedIndex >= 0) {
      if (feeds.list[feedIndex].subs.length > 0) {
        request(`https://www.reddit.com/r/${feeds.list[feedIndex].subs[Math.floor(Math.random() * feeds.list[feedIndex].subs.length)]}/hot.json?count=100&limit=100`, async (err, req, res) => {
          if (!err) {
            const data = JSON.parse(res);
            if (data?.data?.children != undefined) {
              const filtered = data.data.children.filter((item) => {
                return (item.kind === 't3' && !item.data.is_video && !item.data.stickied && !feeds.list[feedIndex].posted.includes(item.data.id));
              });
              if (filtered.length > 0) {
                const images = [];

                if (feeds.list[feedIndex].posted.length >= 1000) feeds.list[feedIndex].posted.shift();
                feeds.list[feedIndex].posted.push(filtered[0].data.id);

                if (filtered[0].data.url.includes('redgifs.com')) {
                  let image = filtered[0].data.secure_media?.oembed?.thumbnail_url;
                  if (image) {
                    image = image.split('.');
                    image[image.length-1] = 'mp4';
                    images.push(image.join('.'));
                  } else if (filtered[0].data.preview?.reddit_video_preview) images.push(filtered[0].data.preview?.reddit_video_preview);
                  else images.push(filtered[0].data.url);
                } else if (filtered[0].data.url.includes('reddit.com/gallery')) {
                  for (const [key] of Object.entries(filtered[0].data.media_metadata)) images.push(`https://i.redd.it/${key}.jpg`);
                } else images.push(filtered[0].data.url);

                client.channels.resolve(feeds.list[feedIndex].channel).send({content: `**${filtered[0].data.title}** - ${filtered[0].data.subreddit_name_prefixed} - https://reddit.com/u/${filtered[0].data.author}\n${images.join('\n')}`});
                updateFeed();
              }
            }
          }
        });
      }
    }
  };
};
