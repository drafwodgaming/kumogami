import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MediaGalleryBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import { fetchAnime } from '../utils/anime/api/fetchAnime.js'
import { getLocalizedText } from '../utils/general/getLocale.js'

const config = new SlashCommandBuilder()
	.setName('anime')
	.setDescription('Search anime by name')
	.addStringOption(option =>
		option
			.setName('name')
			.setDescription('Enter the anime title')
			.setRequired(true)
			.setAutocomplete(true)
	)
config.beta = true

export const autocomplete = async interaction => {
	const focusedInput = interaction.options.getFocused()
	const locale = await getLocalizedText(interaction)
	const api = locale('commands.anime.api')

	const animeList = await fetchAnime({ api, query: focusedInput })
	const autocompleteOptions = animeList
		.map(anime => ({
			name:
				api === 'shikimori'
					? locale('commands.anime.title', {
							title: anime.russian || anime.name,
					  })
					: locale('commands.anime.title', {
							title: anime.title.english || anime.title.romaji || anime.title.native,
					  }),
			value: String(anime.id),
		}))
		.slice(0, 25)

	await interaction.respond(autocompleteOptions)
}

export const execute = async interaction => {
	await interaction.deferReply()

	const selectedAnimeId = interaction.options.getString('name')
	const locale = await getLocalizedText(interaction)
	const api = locale('commands.anime.api')

	let animeData
	animeData = await fetchAnime({ api, id: selectedAnimeId })

	let title, description, url, imageUrl, genres, episodeCount, scoreValue

	if (api === 'anilist') {
		title = locale('commands.anime.title', {
			title:
				animeData.title.english || animeData.title.romaji || animeData.title.native,
		})
		description = locale('commands.anime.description', {
			description: animeData.description.replace(/<[^>]*>?/gm, ''),
		})
		url = locale('commands.anime.url', {
			animeUrl: animeData.siteUrl,
		})
		imageUrl = locale('commands.anime.image', {
			image: animeData.coverImage?.large,
		})
		genres = locale('commands.anime.genres', {
			genres: animeData.genres.join(', '),
		})
		episodeCount = locale('commands.anime.episodeCount', {
			episodeCount: animeData.episodes,
		})
		scoreValue = locale('commands.anime.score', {
			score: animeData.averageScore / 10,
		})
	} else if (api === 'shikimori') {
		title = locale('commands.anime.title', {
			title: animeData.russian || animeData.name,
		})
		description = locale('commands.anime.description', {
			description: animeData.description,
		})
		url = locale('commands.anime.url', {
			animeUrl: `https://shikimori.one${animeData.url}`,
		})
		imageUrl = locale('commands.anime.image', {
			image:
				`https://shikimori.one${animeData.image.original}` ||
				`https://shikimori.one${animeData.image.preview}`,
		})
		genres = locale('commands.anime.genres', {
			genres: animeData.genres?.map(genre => genre.russian).join(', '),
		})
		episodeCount = locale('commands.anime.episodeCount', {
			episodeCount: String(animeData.episodes),
		})
		scoreValue = locale('commands.anime.score', {
			score: String(animeData.score),
		})
	}

	const linkButton = new ButtonBuilder()
		.setLabel(locale('commands.anime.animeView'))
		.setStyle(ButtonStyle.Link)
		.setURL(url)

	const container = new ContainerBuilder({
		components: [
			new MediaGalleryBuilder().addItems([{ media: { url: imageUrl } }]),
			new TextDisplayBuilder().setContent(
				`### ${title}\n${description.slice(0, 2048)}`
			),
			new TextDisplayBuilder().setContent(
				`${genres}\n${episodeCount}\n${scoreValue}`
			),
			new SeparatorBuilder(SeparatorSpacingSize.Medium),
			new ActionRowBuilder().addComponents(linkButton),
		],
	})

	await interaction.editReply({
		flags: MessageFlags.IsComponentsV2,
		components: [container],
	})
}

export default { config, autocomplete, execute }
