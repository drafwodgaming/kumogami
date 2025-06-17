import {
	ActionRowBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	ContainerBuilder,
	MessageFlags,
	PermissionFlagsBits,
	SeparatorBuilder,
	SeparatorSpacingSize,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import { getColor } from '../../utils/general/getColor.js'
import { getLocalizedText } from '../../utils/general/getLocale.js'
export const config = new SlashCommandBuilder()
	.setName('channels')
	.setDescription('Select channels')
	.setDescriptionLocalizations({
		ru: 'Настройка каналов',
		uk: 'Налаштування каналів',
	})
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(subcommand =>
		subcommand
			.setName('setup')
			.setDescription('Setup channels')
			.setDescriptionLocalizations({
				ru: 'Настройка каналов',
				uk: 'Налаштування каналів',
			}),
	)
	.setContexts('Guild')

export async function execute(interaction) {
	await interaction.deferReply({ flags: 64 })

	const subCommand = interaction.options.getSubcommand()
	const locale = await getLocalizedText(interaction)
	const defaultBotColor = getColor('bot', '0x')

	switch (subCommand) {
		case 'setup': {
			const titleDisplay = new TextDisplayBuilder().setContent(
				`${locale('components.setupDescription.title')}`,
			)

			const separator = new SeparatorBuilder(SeparatorSpacingSize.Medium)

			const descriptionDisplay = new TextDisplayBuilder().setContent(
				`${locale('components.setupDescription.text')}`,
			)

			const selectsData = [
				{
					customId: 'chooseWelcomeChannel',
					placeholder: locale('components.menus.welcomeChannelSelect.placeholder'),
					channelType: ChannelType.GuildText,
				},
				{
					customId: 'chooseLeaveChannel',
					placeholder: locale('components.menus.leaveChannelSelect.placeholder'),
					channelType: ChannelType.GuildText,
				},
				{
					customId: 'chooseVoiceHubChannel',
					placeholder: locale('components.menus.JTCSystemChannelSelect.placeholder'),
					channelType: ChannelType.GuildVoice,
				},
			]

			const actionRows = selectsData.map(
				({ customId, placeholder, channelType }) =>
					new ActionRowBuilder().addComponents(
						new ChannelSelectMenuBuilder()
							.setCustomId(customId)
							.setPlaceholder(placeholder)
							.setChannelTypes([channelType])
							.setMaxValues(1),
					),
			)

			const container = new ContainerBuilder({
				components: [titleDisplay, separator, descriptionDisplay, ...actionRows],
			}).setAccentColor(defaultBotColor)

			await interaction.editReply({
				flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,

				components: [container],
			})
			break
		}
	}
}

export default { config, execute }
