const drawRoundedRect = ({ context, x, y, width, height, radius = 0 }) => {
	const startX = x + radius
	const startY = y + radius
	const endX = x + width - radius
	const endY = y + height - radius

	context.beginPath()
	context.moveTo(startX, y)
	context.lineTo(endX, y)
	context.arc(endX, startY, radius, Math.PI * 1.5, Math.PI * 2)
	context.lineTo(x + width, endY)
	context.arc(endX, endY, radius, 0, Math.PI * 0.5)
	context.lineTo(startX, y + height)
	context.arc(startX, endY, radius, Math.PI * 0.5, Math.PI)
	context.lineTo(x, startY)
	context.arc(startX, startY, radius, Math.PI, Math.PI * 1.5)
	context.closePath()
}

export { drawRoundedRect }
