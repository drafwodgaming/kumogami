import { fetchAnilist } from './fetchAnilist.js'
import { fetchShikimori } from './fetchShikimori.js'

export async function fetchAnime({ api = 'shikimori', id, query }) {
	if (api === 'shikimori') return fetchShikimori({ id, query })
	else if (api === 'anilist') return fetchAnilist({ id, query })
	else throw new Error(`Unknown API: ${api}`)
}
