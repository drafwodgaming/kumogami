import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import serverLocaleShema from '../../schemas/serverLocale.js'
import { getLanguageFlag } from '../../utils/general/getLanguageFlag.js'
import { getLanguageName } from '../../utils/general/getLanguageName.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'

export const config = new SlashCommandBuilder()
	.setName('locale')
	.setDescription('Set the language for the server')
	.setDescriptionLocalizations({
		ru: 'Установить язык для сервера',
		uk: 'Налаштувати мову для сервера',
	})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(subcommand =>
		subcommand
			.setName('setup')
			.setDescription('Set the language for the server')
			.setDescriptionLocalizations({
				ru: 'Установить язык для сервера',
				uk: 'Налаштувати мову для сервера',
			})
			.addStringOption(option =>
				option
					.setName('language')
					.setDescription('Choose Language')
					.setDescriptionLocalizations({
						ru: 'Выбрать язык',
						uk: 'Вибрати мову',
					})
					.setRequired(true)
					.addChoices(
						{ name: 'English', value: 'en' },
						{ name: 'Русский', value: 'ru' },
						{ name: 'Українська', value: 'uk' },
					),
			),
	)
	.setContexts('Guild')

export async function execute(interaction) {
	await interaction.deferReply({ flags: 64 })
	const { guild, options } = interaction

	const selectedLocale = options.getString('language')
	await serverLocaleShema.updateOne(
		{ Guild: guild.id },
		{ $set: { Language: selectedLocale } },
		{ upsert: true },
	)

	const locale = await getLocalizedText(interaction)
	const content = locale('commands.language.updated', {
		flag: getLanguageFlag(selectedLocale),
		language: getLanguageName(selectedLocale),
	})

	return await interaction.editReply({ content })
}

export default { config, execute }
