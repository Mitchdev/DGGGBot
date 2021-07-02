module.exports = function(client) {
  client.on('threadCreate', (threadChannel) => {
    if (threadChannel.joinable) threadChannel.join();
  });
};
