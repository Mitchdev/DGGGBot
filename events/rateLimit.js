module.exports = function(client) {
  client.on('rateLimit', (string) => {
      console.log(`RATELIMIT`);
      console.log(string);
      console.log(`RATELIMIT_END`);
  });
};
