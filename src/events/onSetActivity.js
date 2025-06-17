import { ActivityType, Events } from 'discord.js'

export const event = { name: Events.ClientReady, once: true }

export default async client => {
	const updatePresence = async () => {
		await client.guilds.fetch()

		const activities = [
			{
				name: `${client.guilds.cache.size} 寺 | Temples`,
				type: ActivityType.Watching,
			},
			{
				name: '☁️ Stormgazing',
				type: ActivityType.Playing,
			},
		]

		client.user?.setActivity(
			activities[Math.floor(Math.random() * activities.length)],
		)
	}

	updatePresence()
	setInterval(() => updatePresence(), 120_000)
}
