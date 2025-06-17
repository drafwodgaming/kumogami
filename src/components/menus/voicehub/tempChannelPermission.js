import { ActionRowBuilder, UserSelectMenuBuilder } from 'discord.js'
import { getLocalizedText } from '../../../utils/general/getLocale.js'

export const customID = 'channelPermission'

export default async interaction => {
	await interaction.deferReply({ flags: 64 })

	const locale = await getLocalizedText(interaction)
	const selectedAction = interaction.values[0]
	const channel = interaction.channel

	switch (selectedAction) {
		case 'channelLock':
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
				Connect: false,
			})
			await interaction.editReply({
				content: locale('events.voiceHub.permissionsUpdated'),
			})
			break
		case 'channelUnlock':
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
				Connect: true,
			})
			await interaction.editReply({
				content: locale('events.voiceHub.permissionsUpdated'),
			})
			break
		case 'channelInvite':
			const userSelector = new UserSelectMenuBuilder()
				.setCustomId('inviteUser')
				.setPlaceholder(
					locale('components.menus.voiceHub.channelInvite.placeholder')
				)

			const inviteRow = new ActionRowBuilder().addComponents(userSelector)

			await interaction.editReply({ components: [inviteRow] })
			break
		default:
			break
	}
}
