from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse
import shutil
import time
import os
from app.services.audio_processing import extract_audio  # 音声抽出モジュール
from app.services.emotion_analysis import analyze_audio_emotion  # 感情分析モジュール
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()  # .env の読み込み

app = FastAPI()

# 環境変数を取得するエンドポイント
@app.get("/adsense-config")
async def get_adsense_config():
    return JSONResponse({
        "client_id": os.getenv("ADSENSE_CLIENT_ID"),
        "slot_id": os.getenv("ADSENSE_SLOT_ID"),
    })

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

UPLOADS_DIR = "uploads"
EXPIRATION_TIME = 7 * 24 * 60 * 60  # 7日 (秒単位)
MAX_STORAGE_USAGE = 80  # 80%を超えたら削除

def cleanup_uploads():
    """ 一定期間経過したファイルを削除 """
    now = time.time()
    for filename in os.listdir(UPLOADS_DIR):
        file_path = os.path.join(UPLOADS_DIR, filename)
        if os.path.isfile(file_path) and now - os.path.getmtime(file_path) > EXPIRATION_TIME:
            os.remove(file_path)
            print(f"Deleted: {file_path}")

def check_and_cleanup():
    """ ディスク使用率を監視し、必要に応じてファイル削除 """
    total, used, free = shutil.disk_usage("/")
    usage_percent = (used / total) * 100
    if usage_percent > MAX_STORAGE_USAGE:
        print(f"Storage usage {usage_percent:.2f}% exceeds limit. Cleaning up...")
        cleanup_uploads()

def scheduled_cleanup():
    """ 定期的にストレージ監視を実行するループ """
    while True:
        check_and_cleanup()
        time.sleep(3600)  # 1時間ごとに実行

@app.on_event("startup")
def startup_event():
    """ FastAPI 起動時にバックグラウンドで実行 """
    import threading
    thread = threading.Thread(target=scheduled_cleanup, daemon=True)
    thread.start()