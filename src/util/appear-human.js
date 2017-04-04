// Add artificial delay to function execution to appear more human-like.

const config	= require('config')
const R			= require('ramda')

const appearHuman = (args = []) => {

	// In case we got just a string
	args = [args]
	// Flatten it all down to one array
	args = R.flatten(args)

	// Get the config values
	const minDelay = config.get('minHumanDelay')
	const charDelay = config.get('perCharHumanDelay')

	return new Promise((resolve) => {

		//reduce the arguments to one size
		const cumulativeSize = args.reduce((previous, current) => {
			const size = typeof current === 'string' ? current.length : 0
			return previous + size
		}, 0)

		//Add the per character delay to take into notion the size of the job
		const calculatedDelay = Math.max(minDelay, cumulativeSize * charDelay)

		setTimeout(resolve, calculatedDelay)

	})

}

module.exports = appearHuman
