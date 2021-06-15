module.exports = function(client) {
  escapeHtml = function(text, reverse) {
    // const SymboltoHTML = {
    //   '&': '&amp;',
    //   '<': '&lt;',
    //   '>': '&gt;',
    //   '"': '&quot;',
    //   '\'': '&#039;',
    //   '°': '&deg;',
    //   'á': '&aacute;',
    // };
    // const HTMLtoSymbol = {
    //   '&amp;': '&',
    //   '&lt;': '<',
    //   '&gt;': '>',
    //   '&quot;': '"',
    //   '&#039;': '\'',
    //   '&deg;': '°',
    //   '&aacute;': 'á',
    // };

    if (reverse) {
      return htmlEntities.decode(text);
    } else {
      return htmlEntities.encode(text);
    }

    // if (reverse) {
    //   const regex = new RegExp(HTMLtoSymbol.map((m) => `|${m}|`).join('|'), 'g');
    //   console.log(regex);
    //   return text.replace(regex, (m) => {
    //     return HTMLtoSymbol[m];
    //   });
    // } else {
    //   const regex = new RegExp(SymboltoHTML.map((m) => `|${m}|`).join('|'), 'g');
    //   return text.replace(regex, (m) => {
    //     return SymboltoHTML[m];
    //   });
    // }
  };
};
