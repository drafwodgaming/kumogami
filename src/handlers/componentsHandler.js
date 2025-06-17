import fg from 'fast-glob'
import path from 'path'
import { pathToFileURL } from 'url'

export default (client, sourcePath) => {
	client.componentsHandler = async () => {
		const { modals, buttons, selectMenus } = client
		const componentsPath = path.join(sourcePath, 'components')
		const folders = ['modals', 'buttons', 'menus']

		for (const folder of folders) {
			const folderPath = path.join(componentsPath, folder)
			const files = await fg('**/*.js', {
				cwd: folderPath,
				absolute: true,
			})

			for (const file of files) {
				const module = await import(pathToFileURL(file).href)

				const id = module.customID
				const action = module.default

				if (folder === 'modals') modals.set(id, action)
				else if (folder === 'buttons') buttons.set(id, action)
				else if (folder === 'menus') selectMenus.set(id, action)
			}
		}

		console.log('✅ Loaded components')
	}
}
