from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import yt_dlp
import io
import os
import urllib.parse

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001", 
        "http://localhost:3000",  # React dev server ports
        "https://yt-downloader-frontend.onrender.com",  # Production frontend
        "https://yt-downloader-mkl4.onrender.com"  # Your current domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_youtube_m4a_bytes(url: str) -> tuple[io.BytesIO, str]:
    """
    Downloads YouTube audio as .m4a into memory (BytesIO).
    Returns buffer and safe filename.
    """
    buffer = io.BytesIO()
    temp_filename = "temp"

    ydl_opts = {
        "format": "bestaudio[ext=m4a]/bestaudio/best",
        "outtmpl": temp_filename,
        "cookiefile": "cookies.txt",
        "geo_bypass": True,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "m4a",
                "preferredquality": "192",
            }
        ],
        "quiet": True,
        "no_warnings": True,
    }


    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)

    temp_filename += ".m4a"
    # Read into memory
    with open(temp_filename, "rb") as f:
        buffer.write(f.read())

    os.remove(temp_filename)
    buffer.seek(0)

    # Get safe filename
    title = info.get("title", "audio")
    safe_filename = f"{title}.m4a"
    print(title)
    print(safe_filename)
    return buffer, safe_filename


@app.get("/download")
async def download_audio(url: str = Query(..., description="YouTube video URL")):
    try:
        audio_bytes, filename = get_youtube_m4a_bytes(url)

        # Encode filename for Content-Disposition (handles UTF-8 safely)
        quoted_filename = urllib.parse.quote(filename)
        print(quoted_filename)
        headers = {
            "Content-Disposition": f"attachment; filename*=UTF-8''{quoted_filename}"
        }

        return StreamingResponse(
            audio_bytes,
            media_type="audio/mp4",
            headers=headers,
        )

    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

# Serve React build
# Serve static assets from CRA build directory
if os.path.isdir("build"):
    app.mount("/static", StaticFiles(directory="build/static"), name="static")


@app.get("/")
async def serve_index_root():
    if os.path.isfile("build/index.html"):
        return FileResponse("build/index.html")
    return JSONResponse(status_code=404, content={"error": "Frontend not built yet"})


@app.get("/{full_path:path}")
async def serve_index_catch_all(full_path: str):
    # Let explicit API route(s) handle their paths
    if full_path.startswith("download"):
        return JSONResponse(status_code=404, content={"error": "Not Found"})

    if os.path.isfile("build/index.html"):
        return FileResponse("build/index.html")
    return JSONResponse(status_code=404, content={"error": "Frontend not built yet"})
