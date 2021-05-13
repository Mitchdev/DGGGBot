module.exports = function(client) {
	reloadFeed = function(channel) {
        var feedIndex = feeds.list.findIndex(feed => feed.channel == channel);
        if (feedIndex >= 0) {
            if (feeds.list[feedIndex].subs.length > 0) {
                request(`https://www.reddit.com/r/${feeds.list[feedIndex].subs[Math.floor(Math.random() * feeds.list[feedIndex].subs.length)]}/hot.json`, (err, req, res) => {
                    if (!err) {
                        var data = JSON.parse(res);
                        var filtered = data.data.children.filter(item => {
                            return (item.kind === 't3' && !item.data.is_video && !item.data.stickied && !feeds.list[feedIndex].posted.includes(item.data.id));
                        });
                        if (filtered.length > 0) {
                            var images = [];
        
                            if (feeds.list[feedIndex].posted.length >= 250) feeds.list[feedIndex].posted.shift();
                            feeds.list[feedIndex].posted.push(filtered[0].data.id);
        
                            if (filtered[0].data.url.includes('redgifs.com')) {
                                var image = filtered[0].data.secure_media.oembed.thumbnail_url.split('.');
                                if (image.length > 0) {
                                    image[image.length-1] = 'mp4';
                                    images.push(image.join('.'));
                                } else {
                                    images.push(filtered[0].data.preview.reddit_video_preview);
                                }
                            } else if (filtered[0].data.url.includes('reddit.com/gallery')) {
                                for (const [key, value] of Object.entries(filtered[0].data.media_metadata)) {
                                    images.push(`https://i.redd.it/${key}.jpg`);
                                }
                            } else {
                                images.push(filtered[0].data.url);
                            }
                            
                            client.channels.resolve(feeds.list[feedIndex].channel).send(`**${filtered[0].data.title}** - ${filtered[0].data.subreddit_name_prefixed}\n${images.join('\n')}`);
                            updateFeed();
                        }
                    }
                });
            }
        }
	}
}