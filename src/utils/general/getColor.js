const colors = {
	bot: 'rgb(117, 158, 249)',
	success: 'rgb(144, 238, 144)',
	white: 'rgb(240, 240, 240)',
	edit: 'rgb(100, 149, 237)',
	warning: 'rgb(255, 214, 92)',
	persianRed: 'rgb(205, 92, 92)',
	crimson: 'rgb(197, 49, 56)',
	green: 'rgb(0, 169, 60)',
	emerald: 'rgb(0, 210, 121)',
	bittersweet: 'rgb(245, 96, 98)',
	raisinBlack: 'rgb(29, 30, 34)',
}

const getColor = (name, format) => {
	const color = colors[name]
	if (!color) return null

	const rgb = color.match(/\d+/g)?.map(Number)
	if (!rgb || rgb.length !== 3) return null

	const [red, green, blue] = rgb

	switch (format) {
		case 'hex':
		case '#':
			return `#${((1 << 24) | (red << 16) | (green << 8) | blue)
				.toString(16)
				.slice(1)}`
		case '0x':
			return (red << 16) + (green << 8) + blue
		case 'rgb':
		default:
			return color
	}
}

export { getColor }
