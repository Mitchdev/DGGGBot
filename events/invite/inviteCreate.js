module.exports = function(client) {
  client.on('inviteCreate', (invite) => {
    inviteList[invite.code] = {'uses': invite.uses, 'user': invite.inviter.username};
  });
};
