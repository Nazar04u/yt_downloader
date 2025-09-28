# YouTube Audio Downloader

A full-stack web application that allows users to download YouTube videos as high-quality MP4 audio files. Built with FastAPI backend and React frontend.

## Features

- 🎵 Download YouTube videos as M4A audio files
- ⚡ High-quality audio (192kbps)
- 🎨 Modern, responsive React frontend
- 🚀 Easy deployment with Render
- 🔒 Secure and fast downloads

## Local Development

### Prerequisites

- Python 3.8+
- Node.js 16+
- FFmpeg

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:8008` and will proxy API requests to the backend at `http://localhost:8000`.

## Deployment

This application is configured for easy deployment on Render:

1. Push your code to a Git repository
2. Connect the repository to Render
3. The `render.yaml` file will automatically configure the deployment

The deployment process will:
- Install FFmpeg and Node.js
- Install Python dependencies
- Install and build the React frontend
- Start the FastAPI server

## API Endpoints

- `GET /` - Serves the React frontend
- `GET /download?url={youtube_url}` - Downloads YouTube audio as M4A file

## Project Structure

```
yt-downloader/
├── main.py              # FastAPI backend
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
├── render.yaml         # Render deployment config
├── public/             # React public files
├── src/                # React source code
│   ├── App.js          # Main React component
│   ├── App.css         # Styles
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
└── build/              # Built React app (generated)
```

## Usage

1. Open the web application
2. Paste a YouTube video URL
3. Click "Download Audio"
4. The M4A file will be downloaded to your device

## License

MIT License
