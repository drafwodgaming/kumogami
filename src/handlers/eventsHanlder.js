import fg from 'fast-glob'
import path from 'path'
import { pathToFileURL } from 'url'

export default (client, sourcePath) => {
	client.eventsHandler = async () => {
		const eventsPath = path.join(sourcePath, 'events')
		const files = await fg('**/*.js', {
			cwd: eventsPath,
			absolute: true,
		})

		for (const file of files) {
			const module = await import(pathToFileURL(file).href)
			const { event } = module
			const handler = module.default

			const listener = (...args) => handler(...args, client)

			if (event.once) client.once(event.name, listener)
			else client.on(event.name, listener)
		}

		console.log('✅ Loaded events')
	}
}
