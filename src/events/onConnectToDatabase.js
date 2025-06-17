import { Events } from 'discord.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const event = { name: Events.ClientReady, once: true }

export default async () => {
	const uri = process.env.MONGO_URL
	if (!uri) return console.warn('MongoDB URL is not provided in the .env file')

	await mongoose.connect(uri).then(() => console.log('Connected to MongoDB'))
}
