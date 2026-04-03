import React, { useState, useEffect } from 'react';
import Generator from './pages/Generator';
import History from './pages/History';
import './App.css';

export default function App() {
  const [page, setPage]       = useState('generator');
  const [result, setResult]   = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || 'http://localhost:8000') + '/api/history')
      .then(res => res.json())
      .then(data => { if (data.success) setHistory(data.history); })
      .catch(() => {});
  }, []);

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand">
          <img src="/logo-mark.png" alt="Shipify" className="nav-logo-img" />
          <span className="nav-title">Shipify</span>
          <span className="nav-badge">beta</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-btn ${page === 'generator' ? 'active' : ''}`}
            onClick={() => setPage('generator')}
          >
            Generate
          </button>
          <button
            className={`nav-btn ${page === 'history' ? 'active' : ''}`}
            onClick={() => setPage('history')}
          >
            History
            {history.length > 0 && <span className="nav-count">{history.length}</span>}
          </button>
          <div className="nav-sep" />
          <a
            href="https://github.com/kalviumcommunity/Karan_Squad62_Attendance_management_project"
            target="_blank"
            rel="noreferrer"
            className="nav-gh"
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>
      </nav>

      <main className="main">
        {page === 'generator' && (
          <Generator
            result={result}
            setResult={(r) => { setResult(r); setHistory(h => [r, ...h].slice(0, 20)); }}
          />
        )}
        {page === 'history' && (
          <History
            history={history}
            onSelect={(item) => { setResult(item); setPage('generator'); }}
          />
        )}
      </main>
    </div>
  );
}
