from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Vue のビルドフォルダを静的ファイルとして提供
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ルートアクセス時に Vue の index.html を返す
@app.get("/")
async def serve_frontend():
    index_path = "app/static/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "index.html not found"}
