from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torch
import torchaudio

# Facebookのwav2vec2モデルをロード
model_name = "facebook/wav2vec2-base-960h"
processor = Wav2Vec2Processor.from_pretrained(model_name)
model = Wav2Vec2ForCTC.from_pretrained(model_name)

# 音声データをロード（16kHzにリサンプリング）
def analyze_audio_emotion(text):
    """
    テキストを受け取り、感情分析を行う関数
    """
    from transformers import pipeline

    # BART を使った感情分析モデルをロード
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    # 感情カテゴリ
    candidate_labels = ["joyful", "happy", "fear", "sad", "surprise"]

    # 予測
    result = classifier(text, candidate_labels)

    # 結果を辞書に変換
    emotion_scores = {label: score for label, score in zip(result["labels"], result["scores"])}

    return emotion_scores