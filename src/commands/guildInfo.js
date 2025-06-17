import { bold, ChannelType, SlashCommandBuilder } from 'discord.js'
import emojis from '../../config/bot/emojis.json' with { type: 'json' }
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

export const config = new SlashCommandBuilder()
	.setName('guid')
	.setDescription('View information about the server')
	.setDescriptionLocalizations({
		ru: 'Показать общую информацию о сервере',
		uk: 'Показати загальну інформацію про сервер',
	})
	.addSubcommand(subcommand =>
		subcommand
			.setName('info')
			.setDescription('View information about the server')
			.setDescriptionLocalizations({
				ru: 'Показать общую информацию о сервере',
				uk: 'Показати загальну інформацію про сервер',
			}),
	)
	.setContexts('Guild')

export async function execute(interaction) {
	await interaction.deferReply()

	const locale = await getLocalizedText(interaction)

	const { guild } = interaction
	const { name: guildName, id: guildId, description } = guild
	const { members, roles, channels } = guild
	const { ownerId, createdTimestamp } = guild

	const guildIconURL = guild.iconURL()

	const defaultBotColor = getColor('bot', '0x')

	await members.fetch()
	const totalMembersCount = members.cache.size
	const nonBotMembersCount = members.cache.filter(
		member => !member.user.bot,
	).size
	const botMembersCount = totalMembersCount - nonBotMembersCount

	const channelCounts = {
		total: 0,
		categories: 0,
		text: 0,
		voice: 0,
		stage: 0,
		forum: 0,
	}

	channels.cache.forEach(channel => {
		channelCounts.total++
		switch (channel.type) {
			case ChannelType.GuildCategory:
				channelCounts.categories++
				break
			case ChannelType.GuildText:
				channelCounts.text++
				break
			case ChannelType.GuildVoice:
				channelCounts.voice++
				break
			case ChannelType.GuildStageVoice:
				channelCounts.stage++
				break
			case ChannelType.GuildForum:
				channelCounts.forum++
				break
		}
	})

	const totalEmojisCount = guild.emojis.cache.size
	const animatedEmojisCount = guild.emojis.cache.filter(
		emoji => emoji.animated,
	).size
	const staticEmojisCount = totalEmojisCount - animatedEmojisCount

	const totalRolesCount = roles.cache.size
	const maxRolesDisplay = 15
	const displayedRoles = roles.cache
		.map(role => role)
		.slice(0, maxRolesDisplay)
		.join(' ')

	const serverInfoEmbed = {
		color: defaultBotColor,
		description: bold(
			locale('commands.serverInfo.noDescription', { description }),
		),
		fields: [
			{
				name: locale('commands.serverInfo.generalLabel'),
				value: [
					locale('commands.serverInfo.guildOwnerId', { ownerId }),
					locale('commands.serverInfo.createdAt', {
						guildCreatedAt: `<t:${Math.floor(createdTimestamp / 1000)}:R>`,
					}),
				].join('\n'),
			},
			{
				name: locale('commands.serverInfo.totalMembersCount', {
					totalMembersCount,
				}),
				value: [
					locale('commands.serverInfo.guildMembersCount', { nonBotMembersCount }),
					locale('commands.serverInfo.guildBotsCount', { botMembersCount }),
				].join('\n'),
			},
			{
				name: locale('commands.serverInfo.totalChannelsCount', {
					totalChannels: channelCounts.total,
				}),
				value: [
					locale('commands.serverInfo.textChannelsCount', {
						textChannelsIco: emojis.textChannel,
						textChannels: channelCounts.text,
					}),
					locale('commands.serverInfo.voiceChannelsCount', {
						voiceChannelsIco: emojis.voiceChannel,
						voiceChannels: channelCounts.voice,
					}),
					locale('commands.serverInfo.categoriesCount', {
						categoriesIco: emojis.category,
						categoryChannels: channelCounts.categories,
					}),
					locale('commands.serverInfo.stageChannelsCount', {
						stageChannelsIco: emojis.stage,
						stageChannels: channelCounts.stage,
					}),
					locale('commands.serverInfo.forumsCount', {
						forumsIco: emojis.forum,
						forumChannels: channelCounts.forum,
					}),
				].join(' | '),
			},
			{
				name: locale('commands.serverInfo.totalEmojisCount', { totalEmojisCount }),
				value: [
					locale('commands.serverInfo.animatedEmojisCount', { animatedEmojisCount }),
					locale('commands.serverInfo.staticEmojisCount', { staticEmojisCount }),
				].join('\n'),
			},
			{
				name: locale('commands.serverInfo.guildRolesCount', { totalRolesCount }),
				value: displayedRoles,
			},
		],
		thumbnail: { url: guildIconURL },
		author: { name: guildName, iconURL: guildIconURL },
		footer: { text: locale('commands.tag') },
		timestamp: new Date(),
	}

	return await interaction.editReply({ embeds: [serverInfoEmbed] })
}

export default { config, execute }
