import { Schema, model } from 'mongoose'

let voiceTempChannelSchema = new Schema({
	Guild: {
		type: String,
		required: true,
	},
	ChannelId: {
		type: String,
		required: true,
	},
	Creator: {
		type: String,
		required: true,
	},
	ChannelName: {
		type: String,
	},
	Limit: {
		type: Number,
	},
	RenameTime: {
		type: Number,
		default: 0,
	},
})

export default model('voicetempchannels', voiceTempChannelSchema)
