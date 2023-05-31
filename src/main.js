import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import config from 'config'
import { oga } from './oga.js'
import { openai } from './openai.js'
import { initCommand, processTextToChat, INITIAL_SESSION } from './logic.js'
import { about } from './commands/index.js';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core/index.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))
const ENVIRONMENT = process.env.NODE_ENV || 'dev';


bot.use(session())
bot.command('new', initCommand)
bot.command('start', initCommand)
bot.command('about', about());
bot.on(message('voice'), async (ctx) => {
	ctx.session ??= INITIAL_SESSION
	try {
		await ctx.reply(code('Сообщение принято. Жду ответ от сервера...'))	
		const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
		const userId = String(ctx.message.from.id)
		const ogaPath = await oga.create(link.href, userId)
		const mp3Path = await oga.toMp3(ogaPath, userId)
		const text = await openai.transcription(mp3Path)
		await ctx.reply(code(`Ваш запрос: ${text}`))

		await processTextToChat(ctx, text)
	} 	catch (e) {
		console.log('Error while voice message', e.message)
	}
})

bot.on(message('text'), async (ctx) => {
	ctx.session ??= INITIAL_SESSION
	try {
		await ctx.reply(code('Сообщение принято. Жду ответ от сервера...'))		
		await processTextToChat(ctx, ctx.message.text)
	} 	catch (e) {
		console.log('Error while voice massage', e.message)
	}
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
	await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);