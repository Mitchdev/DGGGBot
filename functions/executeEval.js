module.exports = function(client) {
	executeEval = async function(message) {
		try {
			var code = message.content.split(" ").slice(1).join(" ");
			var evaled = await eval(code);
			if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);
			message.channel.send(clean(evaled), {code:"xl", split:true});
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``, {split:true});
		}
	}
}