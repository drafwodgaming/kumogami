import fg from 'fast-glob'
import path from 'path'
import { pathToFileURL } from 'url'

export default (client, sourcePath) => {
	client.commandsHandler = async () => {
		const initLogger = client.loggers.get('base').child('CMD')
		const commandsPath = path.join(sourcePath, 'commands')
		const files = await fg('**/*.js', {
			cwd: commandsPath,
			absolute: true,
		})

		const commands = new Map()
		const commandsArray = []
		let loadedCount = 0
		let skippedCount = 0

		for (const file of files) {
			try {
				const module = await import(pathToFileURL(file).href)
				const { config, execute, autocomplete } = module.default

				if (!config || !execute) {
					initLogger.warn(`Skipping ${config.name} - missing required fields`)
					skippedCount++
					continue
				}

				if (config.beta) {
					const locs = config.descriptionLocalizations ?? {}
					for (const key in locs) {
						locs[key] = `[beta] ${locs[key]}`
					}
					config.setDescriptionLocalizations(locs)
					config.setDescription(`[beta] ${config.description}`)
					initLogger.debug(`Command ${config.name} is marked as beta`)
				}

				commands.set(config.name, { config, execute, autocomplete })
				commandsArray.push(
					typeof config.toJSON === 'function' ? config.toJSON() : config,
				)
				loadedCount++
			} catch (error) {
				initLogger.error(`Failed to load ${config.name}`, {
					error: error.message,
					file: path.basename(file),
				})
				skippedCount++
			}
		}

		client.commands = commands
		client.commandsArray = commandsArray

		initLogger.info(
			`Commands loaded: ${loadedCount} successful, ${skippedCount} skipped`,
		)

		if (skippedCount > 0)
			logger.warning(`${skippedCount} commands were skipped due to errors`)
	}
}
