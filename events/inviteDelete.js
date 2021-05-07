module.exports = function (client) {
    client.on('inviteDelete', (invite) => {
        inviteList = inviteList.filter(inviteItem => inviteItem.code != invite.code);
    });
}