module.exports = function(client) {
	updateRoles = function() {
		fs.writeFileSync('./options/roles.json', JSON.stringify(roles));
	}
}