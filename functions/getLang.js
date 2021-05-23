module.exports = function(client) {
  getLang = function(nameCode, name, callback) {
    const language = languageCodes.filter((lang) => {
      if (name) {
        return lang.code == nameCode;
      } else {
        return lang.name == nameCode;
      }
    });

    if (language.length > 0) {
      if (name) {
        callback(language[0].name);
      } else {
        callback(language[0].code);
      }
    } else {
      callback(null);
    }
  };
};
