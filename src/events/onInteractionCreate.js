import { Events } from 'discord.js'

export const event = { name: Events.InteractionCreate }

export default async (interaction, client) => {
	const { customId } = interaction
	const { modals, buttons, selectMenus, commands } = client

	if (interaction.isAutocomplete()) {
		const command = commands.get(interaction.commandName)
		if (!command) return
		await command.autocomplete(interaction, client)
		return
	}

	if (interaction.isChatInputCommand()) {
		const command = commands.get(interaction.commandName)
		if (!command) return
		await command.execute(interaction, client)
		return
	}

	if (interaction.isModalSubmit()) {
		const modal = modals.get(customId)
		if (modal) await modal(interaction, client)
		return
	}

	if (interaction.isButton()) {
		const button = buttons.get(customId)
		if (button) await button(interaction, client)
		return
	}

	if (interaction.isAnySelectMenu()) {
		const selectMenu = selectMenus.get(customId)
		if (selectMenu) await selectMenu(interaction, client)

		for (const row of interaction.message.components) {
			for (const component of row.components) {
				component.selected_values = []
			}
		}
		try {
			await interaction.message.edit({
				components: interaction.message.components,
			})
		} catch {}
		return
	}
}
