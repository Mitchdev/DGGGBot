module.exports = function(client) {
  secondsToDuration = function(seconds) {
    if (seconds >= 86400) return (seconds/86400)+'d';
    else if (seconds >= 3600) return (seconds/3600)+'h';
    else if (seconds >= 60) return (seconds/60)+'m';
    else return (seconds)+'s';
  };
};
