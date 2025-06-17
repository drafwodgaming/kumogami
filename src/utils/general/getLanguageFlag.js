import emojis from '../../../config/bot/emojis.json' with { type: 'json' }

const getLanguageFlag = languageCode => {
	const languageFlags = {
		en: emojis.englishFlag,
		ru: emojis.russianFlag,
		uk: emojis.ukraineFlag,
	}

	return languageFlags[languageCode] || languageCode
}

export { getLanguageFlag }
