import leaveChannelSchema from '../../schemas/leaveChannel.js'
import { getColor } from '../../utils/general/getColor.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'

const createEmbed = (color, description) => ({
	color,
	description,
})

export const customID = 'chooseLeaveChannel'

export default async interaction => {
	await interaction.deferReply({ flags: 64 })

	const locale = await getLocalizedText(interaction)

	const { guild } = interaction
	const selectedChannelId = interaction.values[0]

	const colors = {
		success: getColor('success', '0x'),
		edit: getColor('edit', '0x'),
		warning: getColor('warning', '0x'),
	}

	const updateData = await leaveChannelSchema.findOneAndUpdate(
		{ Guild: guild.id },
		{ $set: { Channel: selectedChannelId } },
		{ upsert: true },
	)

	if (updateData && updateData.Channel === selectedChannelId) {
		const embedExists = createEmbed(
			colors.warning,
			locale('components.menus.leaveChannelSelect.channelAlreadySet'),
		)
		return interaction.editReply({ embeds: [embedExists] })
	}

	const embedSuccess = createEmbed(
		colors.success,
		locale('components.menus.leaveChannelSelect.channelSet', {
			channelId: selectedChannelId,
		}),
	)
	return interaction.editReply({ embeds: [embedSuccess] })
}
