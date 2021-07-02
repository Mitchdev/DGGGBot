module.exports = function(client) {
  clean = function(str) {
    if (typeof(str) === 'string') {
      return str.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
      return str;
    }
  };
};
