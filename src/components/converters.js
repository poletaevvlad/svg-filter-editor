module.exports = (() => {
	return {
		passthrough: (value) => value,
		float: (value) => parseFloat(value.replace(",", ".")),
		int: (value) => parseInt(value)
	}
})();