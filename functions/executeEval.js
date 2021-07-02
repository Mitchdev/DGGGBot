module.exports = function(client) {
  executeEval = async function(message, noComment = false) {
    try {
      const code = message.content.split(' ').slice(1).join(' ');
      let evaled = await eval(code);
      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled);
      }
      if (!noComment) message.channel.send({content: `\`\`\`xl\n${clean(evaled)}\n\`\`\``});
    } catch (err) {
      message.channel.send({content: `\`ERROR\` \`\`\`xl\n${errSplit[i]}\n\`\`\``});
    }
  };
};
