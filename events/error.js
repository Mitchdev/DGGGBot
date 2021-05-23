module.exports = function(client) {
  client.on('error', (string) => {
    console.log(`ERROR`);
    console.log(string);
    console.log(`ERROR_END`);
  });
};
