module.exports = function(client) {
  worldClock = function(gmtOffset) {
    const time = new Date();
    const gmtMS = time.getTime() + (time.getTimezoneOffset() * 60000);
    const gmtTime = new Date(gmtMS);

    const hr = gmtTime.getHours() + gmtOffset;
    const min = gmtTime.getMinutes();
    const sec = gmtTime.getSeconds();

    return hr + ':' + min + ':' + sec;
  };
};
