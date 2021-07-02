module.exports = function(client) {
  updateRoles = function() {
    fs.writeFileSync(dpath.join(__srcdir, './options/roles.json'), JSON.stringify(roles));
  };
};
