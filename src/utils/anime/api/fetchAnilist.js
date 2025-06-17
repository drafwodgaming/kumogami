import { GraphQLClient, gql } from 'graphql-request'
import { animeCacheTTL } from '../../constants/cacheTime.js'

const client = new GraphQLClient('https://graphql.anilist.co')

const cache = new Map()

const cacheTTL = {
	id: animeCacheTTL.id,
	query: animeCacheTTL.query,
	default: animeCacheTTL.default,
}

const queries = {
	id: gql`
		query ($id: Int) {
			Media(id: $id, type: ANIME) {
				title {
					romaji
					english
					native
				}
				description(asHtml: false)
				coverImage {
					large
				}
				genres
				averageScore
				episodes
				siteUrl
			}
		}
	`,
	query: gql`
		query ($search: String) {
			Page(perPage: 10) {
				media(search: $search, type: ANIME) {
					id
					title {
						romaji
						english
						native
					}
				}
			}
		}
	`,
	default: gql`
		query {
			Page(perPage: 10) {
				media(type: ANIME, sort: POPULARITY_DESC) {
					id
					title {
						romaji
						english
						native
					}
				}
			}
		}
	`,
}

export async function fetchAnilist({ id, query } = {}) {
	let cacheKey, cacheDuration, operationType, variables

	if (id) {
		cacheKey = `id-${id}`
		cacheDuration = cacheTTL.id
		operationType = 'id'
		variables = { id: Number(id) }
	} else if (query) {
		cacheKey = `search-${query}`
		cacheDuration = cacheTTL.query
		operationType = 'query'
		variables = { search: query }
	} else {
		cacheKey = 'default'
		cacheDuration = cacheTTL.default
		operationType = 'default'
		variables = {}
	}

	const currentTimestamp = Date.now()
	const cachedEntry = cache.get(cacheKey)

	if (cachedEntry && currentTimestamp - cachedEntry.timestamp < cacheDuration)
		return cachedEntry.data

	const response = await client.request(queries[operationType], variables)
	const data = response.Media ?? response.Page.media

	cache.set(cacheKey, { data, timestamp: currentTimestamp })

	return data
}
