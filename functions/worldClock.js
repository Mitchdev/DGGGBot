module.exports = function(client) {
	worldClock = function(gmtOffset) {
		var time = new Date()
		var gmtMS = time.getTime() + (time.getTimezoneOffset() * 60000)
		var gmtTime = new Date(gmtMS)

		var hr = gmtTime.getHours() + gmtOffset
		var min = gmtTime.getMinutes()
		var sec = gmtTime.getSeconds()

		return hr + ":" + min + ":" + sec
	}
}