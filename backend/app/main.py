from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# 静的ファイルの提供
app.mount("/static", StaticFiles(directory="/app/frontend/dist"), name="static")

@app.get("/")
def index():
    return FileResponse("/app/frontend/dist/index.html")
