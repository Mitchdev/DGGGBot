module.exports = function(client) {
  customCommandResponse = function(response) {
    return new Promise((resolve) => {
      while (/%RN/gmi.test(response)) {
        response = response.replace('%RN', Math.floor(Math.random() * 10).toString());
      }
      resolve(response);
    });
  };
};
