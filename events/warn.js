module.exports = function(client) {
  client.on('warn', (string) => {
    console.log(`WARN`);
    console.log(string);
    console.log(`WARN_END`);
  });
};
