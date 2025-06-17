import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import path from 'path'

const i18n = i18next.createInstance()

i18n.use(Backend).init({
	initImmediate: false,
	fallbackLng: 'en',
	supportedLngs: ['en', 'ru', 'uk'],
	preload: ['en', 'ru', 'uk'],
	backend: { loadPath: path.join('./config/bot/languages/{{lng}}.json') },
	interpolation: { escapeValue: false },
})

export default i18n
