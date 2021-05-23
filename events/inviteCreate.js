module.exports = function(client) {
  client.on('inviteCreate', (invite) => {
    inviteList.push(invite);
  });
};
