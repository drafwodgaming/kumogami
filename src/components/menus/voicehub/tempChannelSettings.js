import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import { getLocalizedText } from '../../../utils/general/getLocale.js'

export const customID = 'channelSettings'

export default async interaction => {
	const locale = await getLocalizedText(interaction)

	const selectedAction = interaction.values[0]

	switch (selectedAction) {
		case 'channelName': {
			const tempChannelName = new ModalBuilder()
				.setTitle(locale('components.modals.channelName.title'))
				.setCustomId('tempChannelName')

			const inputField = new TextInputBuilder()
				.setCustomId('tempChannelNameInput')
				.setPlaceholder(locale('components.modals.channelName.exampleName'))
				.setLabel(locale('components.modals.channelName.label'))
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

			const row = new ActionRowBuilder().addComponents(inputField)
			tempChannelName.addComponents(row)

			await interaction.showModal(tempChannelName)
			break
		}
		case 'channelLimit': {
			const limitModal = new ModalBuilder()
				.setTitle(locale('components.modals.channelLimit.title'))
				.setCustomId('tempChannelLimit')

			const limitInput = new TextInputBuilder()
				.setCustomId('tempChannelLimitInput')
				.setPlaceholder(locale('components.modals.channelLimit.exampleName'))
				.setLabel(locale('components.modals.channelLimit.label'))
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

			const row = new ActionRowBuilder().addComponents(limitInput)
			limitModal.addComponents(row)

			await interaction.showModal(limitModal)
		}
	}
}
