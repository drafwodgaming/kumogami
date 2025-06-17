import i18n from '../../i18n.js'
import locale from '../../schemas/serverLocale.js'
import { getGuildLanguage } from './getGuildLanguage.js'

export const getLocalizedText = async interaction => {
	const id = interaction.guild?.id || interaction.user?.id
	const lang = await getGuildLanguage(id, locale)
	console.log('Language:', lang)

	const hasLang = i18n.hasResourceBundle(lang, 'translation')
	console.log(`Language "${lang}" loaded:`, hasLang)

	return (key, options) => i18n.t(key, { lng: lang, ...options })
}
