import chalk from 'chalk'

export default client => {
	client.loggerHandler = () => {
		const baseLogger = {
			_log(color, level, message, data) {
				let output = [chalk.gray(`[${level}]`), color(message)].join(' ')

				if (data) {
					output += `\n${chalk.gray(
						typeof data === 'string' ? data : JSON.stringify(data, null, 2),
					)}`
				}

				console.log(output)
			},

			error(message, data, context) {
				baseLogger._log(chalk.red, context, message, data)
			},

			warn(message, data, context) {
				baseLogger._log(chalk.yellow, context, message, data)
			},

			info(message, data, context) {
				baseLogger._log(chalk.blue, context, message, data)
			},

			debug(message, data, context) {
				baseLogger._log(chalk.cyan, context, message, data)
			},

			success(message, data, context) {
				baseLogger._log(chalk.green, context, message, data)
			},

			child(context) {
				return {
					error: (msg, data) => baseLogger.error(msg, data, context),
					warn: (msg, data) => baseLogger.warn(msg, data, context),
					info: (msg, data) => baseLogger.info(msg, data, context),
					debug: (msg, data) => baseLogger.debug(msg, data, context),
					success: (msg, data) => baseLogger.success(msg, data, context),
				}
			},
		}

		// 🔧 Записываем логер в коллекцию
		client.loggers.set('base', baseLogger)
	}
}
