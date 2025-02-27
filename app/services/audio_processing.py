import ffmpeg

def extract_audio(video_path: str, output_audio_path: str):
    ffmpeg.input(video_path).output(output_audio_path, format="mp3").run(overwrite_output=True)
