import { Events } from 'discord.js'
import welcomeChannelSchema from '../schemas/welcomeChannel.js'
import { createWelcomeCardMessage } from '../utils/canvas/createWelcomeCardMessage.js'

export const event = { name: Events.GuildMemberAdd }

export default async member => {
	const { guild, user } = member
	const { channels } = guild

	if (user.bot) return

	const welcomeMessageData = await welcomeChannelSchema.findOne({
		Guild: guild.id,
	})

	if (!welcomeMessageData) return

	const interactionChannel = channels.cache.get(welcomeMessageData.Channel)
	if (!interactionChannel) return

	const messageCanvas = await createWelcomeCardMessage(member)

	await interactionChannel.send({ files: [messageCanvas] })
}
