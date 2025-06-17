import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import { AttachmentBuilder } from 'discord.js'
import { getColor } from '../	general/getColor.js'
import { drawAvatar } from './helper/drawAvatar.js'
import { drawText } from './helper/drawText.js'
import { fillRoundedRect } from './helper/fillRoundedRect.js'

const fonts = {
	luckiestGuyRegular: {
		path: './assets/fonts/LUCKIESTGUY_REGULAR.ttf',
		family: 'Luckiest Guy',
	},
}

const createWelcomeCardMessage = async member => {
	const green = getColor('green', '#')
	const emerald = getColor('emerald', '#')
	const raisinBlack = getColor('raisinBlack', '#')
	const white = getColor('white', '#')

	const { luckiestGuyRegular } = fonts
	GlobalFonts.registerFromPath(
		luckiestGuyRegular.path,
		luckiestGuyRegular.family
	)

	const canvasSize = { width: 1024, height: 450 }
	const canvas = createCanvas(canvasSize.width, canvasSize.height)
	const context = canvas.getContext('2d')

	fillRoundedRect({
		context,
		rectInfo: {
			x: 118.5,
			y: 21,
			width: canvasSize.width / 2 - 118.5,
			height: canvasSize.height * 0.75 - 21,
			radius: 26,
		},
		color: green,
	})

	fillRoundedRect({
		context,
		rectInfo: {
			x: canvasSize.width / 2,
			y: canvasSize.height - (canvasSize.height * 0.75 - 21) - 20,
			width: canvasSize.width - 118.5 - canvasSize.width / 2,
			height: canvasSize.height * 0.75 - 21,
			radius: 26,
		},
		color: emerald,
	})

	fillRoundedRect({
		context,
		rectInfo: {
			x: canvasSize.width / 2 - 364,
			y: canvasSize.height / 2 - 179,
			width: 728,
			height: 358,
			radius: 25,
		},
		color: raisinBlack,
	})

	const avatarRadius = 100
	const avatarX = canvasSize.width / 2
	const avatarY = canvasSize.height - 270

	await drawAvatar({
		context,
		avatarURL: member.user.displayAvatarURL({ extension: 'jpg' }),
		position: { x: avatarX, y: avatarY },
		radius: avatarRadius,
	})

	drawText({
		context,
		text: `Welcome ${member.user.username}!`,
		position: { x: canvasSize.width / 2, y: canvasSize.height - 90 },
		fontSize: 43,
		fontFamily: luckiestGuyRegular.family,
		color: white,
	})

	return new AttachmentBuilder(canvas.toBuffer('image/png'))
}

export { createWelcomeCardMessage }
