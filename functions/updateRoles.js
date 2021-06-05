module.exports = function(client) {
  updateRoles = function() {
    fs.writeFileSync(dpath.join(__dirname, '../options/roles.json'), JSON.stringify(roles));
  };
};
