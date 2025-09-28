import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import PrankPage from './PrankPage';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPrank, setShowPrank] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use environment-based API URL
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://yt-downloader-backend.onrender.com' 
        : 'http://localhost:8008';
      
      const response = await axios.get(`${API_BASE_URL}/download`, {
        params: { url: url.trim() },
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'audio/mp4' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      console.log('Content-Disposition header:', contentDisposition);
      let filename = 'audio.m4a';
      
      if (contentDisposition) {
        // Try both formats: filename*=UTF-8''encoded and filename="quoted"
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        const quotedMatch = contentDisposition.match(/filename="([^"]+)"/);
        
        if (utf8Match) {
          try {
            filename = decodeURIComponent(utf8Match[1]);
            console.log('Decoded filename from UTF-8:', filename);
          } catch (e) {
            console.error('Error decoding UTF-8 filename:', e);
            filename = utf8Match[1]; // Use raw if decoding fails
          }
        } else if (quotedMatch) {
          filename = quotedMatch[1];
          console.log('Filename from quoted format:', filename);
        }
      }
      
      // Fallback: if no filename found, use a timestamp-based name
      if (filename === 'audio.m4a') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        filename = `youtube-audio-${timestamp}.m4a`;
        console.log('Using fallback filename:', filename);
      }
      
      console.log('Final filename:', filename);
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      setUrl('');
      
      // Show prank page after successful download
      setShowPrank(true);
      
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while downloading the audio');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show prank page if triggered
  if (showPrank) {
    return <PrankPage />;
  }

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🎵 YouTube Audio Downloader</h1>
          <p>Download YouTube videos as high-quality MP4 audio files</p>
        </header>

        <main className="main">
          <form onSubmit={handleDownload} className="download-form">
            <div className="input-group">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your YouTube URL here..."
                className="url-input"
                disabled={loading}
              />
              <button
                type="submit"
                className="download-btn"
                disabled={loading || !url.trim()}
              >
                {loading ? '⏳ Downloading...' : '⬇️ Download Audio'}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="features">
            <div className="feature">
              <h3>🎯 High Quality</h3>
              <p>Downloads audio in M4A format at 192kbps quality</p>
            </div>
            <div className="feature">
              <h3>⚡ Fast & Easy</h3>
              <p>Just paste the URL and click download</p>
            </div>
            <div className="feature">
              <h3>🔒 Safe & Secure</h3>
              <p>No data stored, direct download to your device</p>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;
