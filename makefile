build:
	docker build -t VoiceGPT .

run:
	docker run -d -p 3000:3000 --name VoiceGPT --rm VoiceGPT