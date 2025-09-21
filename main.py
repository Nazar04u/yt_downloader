from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse, JSONResponse
import yt_dlp
import io
import os
import urllib.parse

app = FastAPI()

def get_youtube_m4a_bytes(url: str) -> tuple[io.BytesIO, str]:
    """
    Downloads YouTube audio as .m4a into memory (BytesIO).
    Returns buffer and safe filename.
    """
    buffer = io.BytesIO()
    temp_filename = "temp.m4a"

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

    # Read into memory
    with open(temp_filename, "rb") as f:
        buffer.write(f.read())

    os.remove(temp_filename)
    buffer.seek(0)

    # Get safe filename
    title = info.get("title", "audio")
    safe_filename = f"{title}.m4a"

    return buffer, safe_filename


@app.get("/download")
async def download_audio(url: str = Query(..., description="YouTube video URL")):
    try:
        audio_bytes, filename = get_youtube_m4a_bytes(url)

        # Encode filename for Content-Disposition (handles UTF-8 safely)
        quoted_filename = urllib.parse.quote(filename)

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
