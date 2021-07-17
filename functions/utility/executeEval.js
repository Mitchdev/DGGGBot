module.exports = function(client) {
  executeEval = async function(message, Discord, noComment = false) {
    try {
      const code = message.content.split(' ').slice(1).join(' ');
      let evaled = await eval(code);
      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled);
      }
      if (!noComment) splitMessage(null, clean(evaled), 'js', message);
    } catch (err) {
      splitMessage(null, err, 'js', message);
    }
  };
};
