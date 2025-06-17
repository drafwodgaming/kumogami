import { Schema, model } from 'mongoose'

let voiceHubCreatorSchema = new Schema({
	Guild: {
		type: String,
		required: true,
	},
	Channel: {
		type: String,
		required: true,
	},
})

export default model('voicehubchannels', voiceHubCreatorSchema)
