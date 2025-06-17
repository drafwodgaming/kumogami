import { Events } from 'discord.js'
import leaveChannelSchema from '../schemas/leaveChannel.js'
import { createLeaveCardMessage } from '../utils/canvas/createLeaveCardMessage.js'

export const event = { name: Events.GuildMemberRemove }

export default async member => {
	const { guild, user } = member
	const { channels } = guild

	if (user.bot) return

	const leaveMessageData = await leaveChannelSchema.findOne({
		Guild: guild.id,
	})

	if (!leaveMessageData) return

	const interactionChannel = channels.cache.get(leaveMessageData.Channel)
	if (!interactionChannel) return

	const messageCanvas = await createLeaveCardMessage(member)

	await interactionChannel.send({ files: [messageCanvas] })
}
