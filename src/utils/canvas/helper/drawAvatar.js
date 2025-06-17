import { loadImage } from '@napi-rs/canvas'

const drawAvatar = async ({ context, avatarURL, position, radius }) => {
	const avatarImage = await loadImage(avatarURL)

	context.save()

	context.beginPath()
	context.lineWidth = 10
	context.strokeStyle = 'white'
	context.arc(position.x, position.y, radius, 0, Math.PI * 2, true)
	context.stroke()
	context.clip()
	context.drawImage(
		avatarImage,
		position.x - radius,
		position.y - radius,
		radius * 2,
		radius * 2
	)

	context.restore()
}

export { drawAvatar }
