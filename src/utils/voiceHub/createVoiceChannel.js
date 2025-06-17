import { ChannelType, PermissionFlagsBits } from 'discord.js'

const createVoiceChannel = async (guild, member, parentCategory) => {
	const permissions = {
		creator: [
			PermissionFlagsBits.Connect,
			PermissionFlagsBits.Speak,
			PermissionFlagsBits.Stream,
			PermissionFlagsBits.MuteMembers,
			PermissionFlagsBits.DeafenMembers,
			PermissionFlagsBits.MoveMembers,
			PermissionFlagsBits.ManageChannels,
			PermissionFlagsBits.PrioritySpeaker,
			PermissionFlagsBits.UseVAD,
			PermissionFlagsBits.ViewChannel,
		],
		everyone: [
			PermissionFlagsBits.Connect,
			PermissionFlagsBits.Speak,
			PermissionFlagsBits.Stream,
			PermissionFlagsBits.UseVAD,
			PermissionFlagsBits.ViewChannel,
		],
	}

	const permissionOverwrites = [
		{ id: member.id, allow: permissions.creator },
		{ id: guild.id, allow: permissions.everyone },
	]

	const channelOptions = {
		name: `🔊 ${member.displayName}`,
		type: ChannelType.GuildVoice,
		parent: parentCategory,
		permissionOverwrites,
	}

	const channel = await guild.channels.create(channelOptions)

	return channel
}

export { createVoiceChannel }
