import librosa
import numpy as np
import random

def analyze_emotions(audio_path: str) -> dict:
    # 仮の感情スコアをランダムに生成
    emotions = ["嬉しい", "楽しい", "怖い", "悲しい", "驚き"]
    emotion_scores = {emotion: round(random.uniform(0, 1), 2) for emotion in emotions}
    return emotion_scores

