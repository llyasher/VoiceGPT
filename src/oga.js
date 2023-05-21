import axios from 'axios'
import {createWriteStream} from 'fs'
import {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

class OgaConverter {
	constructor() {}

	toMp3() {}

	async create(url, filename) {
		try {
			const ogaPath = resolve(__dirname, '../voices', `${filename}.oga`)
			const response = await axios ({
			method: 'get',
			url,
			responseType: 'stream',
			})
			return new Promise(resolve => {
				const stream = createWriteStream(ogaPath)
				response.data.pipe(stream)
				stream.on('finish', () => resolve(ogaPath))
			})
			
		} catch (e) {
			console.log('Error while creating OGA', e.message)
		}
	}
}

export const oga = new OgaConverter()