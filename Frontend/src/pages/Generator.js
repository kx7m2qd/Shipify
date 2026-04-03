import React, { useState } from 'react';
import axios from 'axios';
import ConfigViewer from '../components/ConfigViewer';
import StackBadge from '../components/StackBadge';
import LoadingSteps from '../components/LoadingSteps';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const STEPS = [
  'Fetching repository tree',
  'Reading dependency files',
  'Detecting stack & services',
  'Generating Dockerfile',
  'Building CI/CD pipeline',
  'Finalizing all configs',
];

const EXAMPLES = [
  'https://github.com/expressjs/express',
  'https://github.com/tiangolo/fastapi',
  'https://github.com/vercel/next.js',
  'https://github.com/gin-gonic/gin',
];

export default function Generator({ result, setResult }) {
  const [url,     setUrl]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [step,    setStep]    = useState(0);

  // Cmd+Enter / Ctrl+Enter to submit
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && url.trim() && !loading) {
        analyze();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [url, loading]);

  const analyze = async (e) => {
    e?.preventDefault();
    if (!url.trim()) return;
    setLoading(true); setError(null); setResult(null); setStep(0);

    let si = 0;
    const iv = setInterval(() => { si++; if (si < STEPS.length) setStep(si); else clearInterval(iv); }, 1900);

    try {
      const res = await axios.post(`${API}/api/analyze`, { githubUrl: url });
      clearInterval(iv);
      setStep(STEPS.length);
      setResult(res.data);
    } catch (err) {
      clearInterval(iv);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          Powered by Groq · LLaMA 3.3 70B
        </div>
        <h1 className="hero-title">
          Ship your code<br />
          <em>without the DevOps headache</em>
        </h1>
        <p className="hero-sub">
          Drop any public GitHub URL. We'll read your codebase and generate
          a production-ready Dockerfile, CI/CD pipeline, docker-compose, and nginx config.
        </p>
        {!result && !loading && (
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">~10s</span>
              <span className="stat-label">avg time</span>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <span className="stat-num">5 files</span>
              <span className="stat-label">generated</span>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <span className="stat-num">Free</span>
              <span className="stat-label">to use</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div className="input-wrap">
        <form onSubmit={analyze}>
          <div className="input-box">
            <span className="input-icon">⌥</span>
            <input
              className="url-input"
              type="text"
              placeholder="github.com/owner/repo"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="go-btn" disabled={loading || !url.trim()}>
              {loading ? 'Analyzing…' : 'Generate'}
              {!loading && <span className="go-btn-arrow">→</span>}
            </button>
          </div>
          {error && (
            <div className="error-msg">
              <span>⚠</span> {error}
            </div>
          )}
          {!result && !loading && (
            <div className="quickpicks">
              <span className="quickpicks-label">Try:</span>
              {EXAMPLES.map(u => (
                <button key={u} type="button" className="chip" onClick={() => setUrl(u)}>
                  {u.replace('https://github.com/', '')}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* ── Loading ── */}
      {loading && <LoadingSteps steps={STEPS} currentStep={step} />}

      {/* ── Result ── */}
      {result && !loading && (
        <div className="result-enter">
          <div className="result-banner">
            <div className="result-left">
              <div className="result-avatar">📦</div>
              <div>
                <div className="result-title">{result.owner}/{result.repoName}</div>
                <div className="result-subtitle">{result.summary?.detectedStack}</div>
              </div>
            </div>
            <div className="badges">
              {(result.summary?.services || []).map(s => (
                <StackBadge key={s} label={s} />
              ))}
            </div>
          </div>

          {(result.summary?.notes || []).map((n, i) => (
            <div key={i} className="note-item">💡 {n}</div>
          ))}

          <ConfigViewer configs={result.configs} repoName={result.repoName} />
        </div>
      )}
    </div>
  );
}
