module.exports = function(client) {
  client.on('inviteDelete', (invite) => {
    delete inviteList[invite.code];
  });
};
