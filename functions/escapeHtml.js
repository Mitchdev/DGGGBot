module.exports = function(client) {
	escapeHtml = function(text, reverse) {

		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;',

			'&amp;': '&',
			'&lt;': '<',
			'&gt;': '>',
			'&quot;': '"',
			"&#039;": '\''
		};

		if (reverse) {
			return text.replace(/(&amp;)|(&lt;)|(&gt;)|(&quot;)|(&#039;)/g, function(m) { return map[m]; })
		} else {
			return text.replace(/[&<>"']/g, function(m) { return map[m]; });
		}
	}
}