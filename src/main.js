import { Telegraf } from 'telegraf'
import config from 'config'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.on()

bot.command('start', async (ctx) => {
	await ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))