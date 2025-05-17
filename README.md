# video-language-convertor
This FastAPI application accepts a video upload, extracts audio, transcribes Hindi speech with punctuation restoration, translates it into a target language, synthesizes translated speech using YourTTS, and finally generates a lip-synced video using Wav2Lip.

Features
Upload video files (mp4, mkv, avi, mov, flv)

Extract audio and transcribe Hindi speech using Whisper

Restore punctuation in transcription

Translate transcription to a target language using M2M100

Synthesize translated speech with YourTTS

Generate lip-synced video output with Wav2Lip

Serve lip-synced video via HTTP
