import { getLocalizedText } from '../../../utils/general/getLocale.js'

export const customID = 'inviteUser'

export default async interaction => {
	const locale = await getLocalizedText(interaction)
	const selectedUserId = interaction.values[0]
	let content

	try {
		const selectedUser = await interaction.guild.members.fetch(selectedUserId)
		await selectedUser.send({
			content: `You have been invited to join the channel: ${interaction.channel.url}`,
		})

		content = locale(components.menus.voiceHub.channelInvite.inviteSuccess)
	} catch (error) {
		content = locale('components.menus.voiceHub.channelInvite.inviteError')
	}

	await interaction.update({ content, components: [], flags: 64 })
}
