const getLanguageName = languageCode =>
	({
		en: 'English',
		ru: 'Русский',
		uk: 'Українська',
	}[languageCode] || languageCode)

export { getLanguageName }
