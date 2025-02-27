from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse  # HTMLResponseをインポート
import shutil
import os
from app.services.audio_processing import extract_audio  # 音声抽出モジュール
from app.services.emotion_analysis import analyze_audio_emotion  # 感情分析モジュール
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# 静的ファイルを提供
app.mount("/static", StaticFiles(directory="static"), name="static")

# テンプレートの場所を指定（templates フォルダ）
templates = Jinja2Templates(directory="app/templates")

# アップロードディレクトリ
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# トップページを表示するGETメソッド
@app.get("/", response_class=HTMLResponse)
async def get_upload_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# ファイルアップロードと感情分析のPOSTメソッド
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # ファイルをアップロードディレクトリに保存
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 音声ファイルの抽出処理
    audio_path = os.path.splitext(file_path)[0] + ".mp3"
    extract_audio(file_path, audio_path)

    # 音声解析を実行
    emotion_scores = analyze_audio_emotion(audio_path)

    # 結果を返す
    return {
        "filename": file.filename,
        "audio_filename": os.path.basename(audio_path),
        "emotion_scores": emotion_scores
    }
