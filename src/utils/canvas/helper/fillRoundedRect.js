import { drawRoundedRect } from './drawRoundRect.js'

const fillRoundedRect = ({ context, rectInfo, color }) => {
	if (typeof color === 'number') {
		color = '#' + color.toString(16).padStart(6, '0')
	}

	context.fillStyle = color
	drawRoundedRect({
		context,
		...rectInfo,
	})
	context.fill()
}

export { fillRoundedRect }
