module.exports = function(client) {
  executeEval = async function(message) {
    try {
      const code = message.content.split(' ').slice(1).join(' ');
      let evaled = await eval(code);
      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled);
      }
      message.channel.send({content: clean(evaled), code: 'xl', split: true});
    } catch (err) {
      message.channel.send({content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``, split: true});
    }
  };
};
