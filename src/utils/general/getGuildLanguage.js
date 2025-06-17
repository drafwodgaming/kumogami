import locale from '../../schemas/serverLocale.js'

const getGuildLanguage = async guildId =>
	(await locale.findOne({ Guild: guildId }))?.Language

export { getGuildLanguage }
