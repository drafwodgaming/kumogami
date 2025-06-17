import voiceTempChannelSchema from '../../schemas/voiceTempChannel.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'

export const customID = 'tempChannelName'

export default async interaction => {
	await interaction.deferReply({ flags: 64 })

	const locale = await getLocalizedText(interaction)

	const channelName = interaction.fields.getTextInputValue(
		'tempChannelNameInput',
	)

	const currentTime = Date.now()
	const fiveMinutes = 5 * 60 * 1000

	const existingChannel = await voiceTempChannelSchema.findOne({
		Guild: interaction.guild.id,
		ChannelId: interaction.channel.id,
	})

	if (existingChannel) {
		if (currentTime - existingChannel.RenameTime < fiveMinutes) {
			const remainingTime =
				fiveMinutes - (currentTime - existingChannel.RenameTime)
			const remainingMinutes = Math.ceil(remainingTime / (60 * 1000))

			return await interaction.editReply(
				locale('components.modals.channelName.renameCooldownMessage', {
					remainingMinutes,
				}),
			)
		}
	}

	await voiceTempChannelSchema.findOneAndUpdate(
		{ Guild: interaction.guild.id, ChannelId: interaction.channel.id },
		{ $set: { ChannelName: channelName, RenameTime: currentTime } },
		{ upsert: true },
	)

	await interaction.channel.setName(channelName)
	await interaction.editReply(
		locale('components.modals.channelName.successMessage'),
	)
}
