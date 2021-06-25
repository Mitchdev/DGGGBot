module.exports = function(client) {
  escapeHtml = function(text, reverse) {
    if (reverse) {
      return htmlEntities.decode(text);
    } else {
      return htmlEntities.encode(text);
    }
  };
};
