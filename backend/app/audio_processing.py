import subprocess
import librosa
import numpy as np
import os

UPLOAD_DIR = "uploads"

def extract_audio(video_path: str, audio_path: str):
    """動画から音声を抽出する関数"""
    command = ["ffmpeg", "-i", video_path, "-q:a", "0", "-map", "a", audio_path]
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def analyze_audio(audio_path: str):
    """音声データから特徴量を抽出し、感情スコアを計算する関数"""
    y, sr = librosa.load(audio_path, sr=None)
    features = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1)

    # 仮の感情分析結果を返す
    return {
        "joyful": np.random.uniform(0, 1),
        "happy": np.random.uniform(0, 1),
        "fear": np.random.uniform(0, 1),
        "sad": np.random.uniform(0, 1),
        "surprise": np.random.uniform(0, 1),
    }
