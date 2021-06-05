module.exports = function(client) {
  secondsToDuration = function(seconds) {
    if (seconds >= 86400) return (seconds/86400).toFixed(2)+'d';
    else if (seconds >= 3600) return (seconds/3600).toFixed(2)+'h';
    else if (seconds >= 60) return (seconds/60).toFixed(2)+'m';
    else return (seconds).toFixed(2)+'s';
  };
};
