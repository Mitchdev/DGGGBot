module.exports = function(client) {
  userHasRole = function(userID, roleID, reqGambles) {
    const found = mutes.list.find((m) => (m.user == userID && m.role == roleID));
    if (found) {
      if (found.gamble > 0 || !reqGambles) {
        const difference = (new Date().getTime() - new Date(found.startTime).getTime()) / 1000;
        const time = (parseInt(found.time) - parseInt(difference) <= 0) ? 0 : parseInt(found.time) - parseInt(difference);
        if (time > 0) {
          return {'found': found, 'time': time};
        }
      } else return {'err': 'You don\'t have any gambles left'};
    }
    return {'err': 'You don\'t have this role as a temp role'};
  };
};
