const drawText = ({ context, text, position, fontSize, fontFamily, color }) => {
	console.log(
		`Drawing text: "${text}" with font: ${fontFamily}, size: ${fontSize}`
	)
	context.textAlign = 'center'
	context.fillStyle = color
	context.font = `${fontSize}px ${fontFamily}`
	context.fillText(text, position.x, position.y)
}

export { drawText }
