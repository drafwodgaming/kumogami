import fetch from 'node-fetch'
import { animeCacheTTL } from '../../constants/cacheTime.js'

const cache = new Map()
const cacheTTL = {
	id: animeCacheTTL.id,
	query: animeCacheTTL.query,
	default: animeCacheTTL.default,
}

const baseUrl = 'https://shikimori.one/api/animes'
const headers = { 'User-Agent': 'DiscordBot/1.0 (anper)' }

export async function fetchShikimori({ id, query } = {}) {
	let cacheKey, cacheDuration, url

	if (id) {
		cacheKey = `id-${id}`
		cacheDuration = cacheTTL.id
		url = `${baseUrl}/${id}`
	} else if (query) {
		cacheKey = `search-${query}`
		cacheDuration = cacheTTL.query
		url = `${baseUrl}?search=${encodeURIComponent(query)}&limit=10`
	} else {
		cacheKey = 'default'
		cacheDuration = cacheTTL.default
		url = `${baseUrl}?order=popularity&limit=10`
	}

	const currentTimestamp = Date.now()
	const cachedEntry = cache.get(cacheKey)

	if (cachedEntry && currentTimestamp - cachedEntry.timestamp < cacheDuration)
		return cachedEntry.data

	const response = await fetch(url, { headers })

	const data = await response.json()
	cache.set(cacheKey, { data, timestamp: currentTimestamp })

	return data
}
