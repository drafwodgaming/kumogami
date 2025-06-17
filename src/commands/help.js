import {
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import emojis from '../../config/bot/emojis.json' with { type: 'json' }
import { getColor } from '../utils/general/getColor.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

const config = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Get the list of commands for the bot')
	.setDescriptionLocalizations({
		ru: 'Отобразить список команд бота',
		uk: 'Показати список команд бота',
	})
	.setContexts('Guild', 'BotDM')

async function execute(interaction) {
	const locale = await getLocalizedText(interaction)
	const defaultBotColor = getColor('bot', '0x')

	const title = new TextDisplayBuilder().setContent(
		locale('commands.help.title', {
			helpEmoji: emojis.helpMenu,
		}),
	)

	const intro = new TextDisplayBuilder().setContent(
		`Use the commands below to interact with the bot.`,
	)

	const separator = new SeparatorBuilder(SeparatorSpacingSize.Medium)

	const commands = [
		{
			name: `anime name`,
			emoji: emojis.animeName,
			description: locale('commands.help.command.anime.description'),
		},
		{
			name: 'serverinfo',
			emoji: emojis.serverInfo,
			description: locale('commands.help.command.serverinfo.description'),
		},
		{
			name: 'channels setup',
			emoji: emojis.animeName,
			description: locale('commands.help.command.setupChannels.description'),
		},
		{
			name: 'locale set',
			emoji: emojis.locale,
			description: locale('commands.help.command.setLocale.description'),
		},
	]

	const footer = new TextDisplayBuilder().setContent(
		'>> © 2025 Your Bot — Все права защищены',
	)

	const commandBlocks = commands.flatMap(({ emoji, description, name }) => [
		new TextDisplayBuilder().setContent(`${emoji} ${description}`),
		new TextDisplayBuilder().setContent(`\`/${name}\``),
	])

	const container = new ContainerBuilder({
		components: [title, intro, separator, ...commandBlocks, separator, footer],
	}).setAccentColor(defaultBotColor)

	await interaction.reply({
		flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
		components: [container],
	})
}

export default { config, execute }
