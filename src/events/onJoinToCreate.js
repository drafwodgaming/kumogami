import { ActionRowBuilder, Events, StringSelectMenuBuilder } from 'discord.js'
import emojis from '../../config/bot/emojis.json' with { type: 'json' }
import voiceHubCreatorSchema from '../schemas/voiceHubCreator.js'
import voiceTempChannelSchema from '../schemas/voiceTempChannel.js'
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'
import { createVoiceChannel } from '../utils/voiceHub/createVoiceChannel.js'

export const event = { name: Events.VoiceStateUpdate }

export default async (oldState, newState) => {
	const locale = await getLocalizedText(newState.member)

	if (oldState.channelId === newState.channelId) return

	const defaultBotColor = getColor('bot', '0x')
	// const messageSelector = locale('')

	if (!oldState.channel && newState.channel) {
		const voiceHubData = await voiceHubCreatorSchema
			.findOne({ Guild: newState.guild.id })
			.lean()

		if (!voiceHubData || newState.channel.id !== voiceHubData.Channel) return

		const parentCategory = newState.channel.parent
		const channel = await createVoiceChannel(
			newState.guild,
			newState.member,
			parentCategory
		)

		await voiceTempChannelSchema.create({
			Guild: newState.guild.id,
			ChannelId: channel.id,
			Creator: newState.member.id,
			ChannelName: channel.name,
			Limit: channel.userLimit,
		})

		const embed = {
			color: defaultBotColor,
			title:locale("events.voiceHub.title"),
			description: `${locale("events.voiceHub.customizeDescription")} 
			${locale("events.voiceHub.importantInfoDescription")}`,
			footer: { text: 'Anper Voice Interface' },
		}

		const channelSettings = new StringSelectMenuBuilder()
			.setCustomId('channelSettings')
			.setPlaceholder(locale("components.menus.voiceHub.channelSettings.placeholder"))
			.setOptions([
				{
					label: locale("components.menus.voiceHub.channelSettings.options.nameLabel"),
					description: locale("components.menus.voiceHub.channelSettings.options.nameDescription"),
					value: 'channelName',
					emoji: emojis.nameTag,
				},
				{
					label: locale("components.menus.voiceHub.channelSettings.options.limitLabel"),
					description: locale("components.menus.voiceHub.channelSettings.options.limitDescription"),
					value: 'channelLimit',
					emoji: emojis.limitPeople,
				},
			])

		const channelPermission = new StringSelectMenuBuilder()
			.setCustomId('channelPermission')
			.setPlaceholder(locale("components.menus.voiceHub.channelPermissions.placeholder"))
			.setOptions([
				{
					label: locale("components.menus.voiceHub.channelPermissions.options.lockChannelLabel"),
					description:
					locale("components.menus.voiceHub.channelPermissions.options.lockChannelDescription"),
					value: 'channelLock',
					emoji: emojis.lockChannel,
				},
				{
					label: locale("components.menus.voiceHub.channelPermissions.options.unlockChannelLabel"),
					description:
						locale("components.menus.voiceHub.channelPermissions.options.unlockChannelDescription"),
					value: 'channelUnlock',
					emoji: emojis.unlockChannel,
				},
				{
					label: locale("components.menus.voiceHub.channelInvite.options.inviteLabel"),
					description: locale("components.menus.voiceHub.channelInvite.options.inviteDescription"),
					value: 'channelInvite',
					emoji: emojis.invite,
				},
			])
			.setMaxValues(1)

		const channelSettingsRow = new ActionRowBuilder().addComponents(
			channelSettings
		)

		const channelPermissionRow = new ActionRowBuilder().addComponents(
			channelPermission
		)

		await channel.send({
			embeds: [embed],
			components: [channelSettingsRow, channelPermissionRow],
		})

		await newState.setChannel(channel).catch(() => {})
	}

	if (oldState.channel && !newState.channel) {
		const voiceTempChannelData = await voiceTempChannelSchema.findOne({
			ChannelId: oldState.channel.id,
		})
		if (!voiceTempChannelData) return

		const channel = oldState.guild.channels.resolve(oldState.channel.id)

		if (channel && channel.members.size === 0) {
			await voiceTempChannelData.deleteOne({ ChannelId: oldState.channel.id })
			await channel.delete().catch(() => {})
		}
	}
}
