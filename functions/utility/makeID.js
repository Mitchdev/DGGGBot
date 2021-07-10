module.exports = function(client) {
  makeID = function() {
    // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // let id = '';
    // for (let i = 0; i < 10; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    // return id;
    return Date.now().toString();
  };
};
