const debug = require('./default.json')
const production = require('./production.json')

const config_manager = (prod) => {
	if (prod) {
		return Object.assign(debug, production)
	} else {
		return debug
	}
}

module.exports = config_manager
