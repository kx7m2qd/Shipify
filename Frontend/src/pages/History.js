import React from 'react';

export default function History({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <div>
        <div className="history-header">
          <div className="page-title">History</div>
        </div>
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <div className="empty-title">Nothing here yet</div>
          <div className="empty-sub">Generate configs for a repo and they'll show up here.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="history-header">
        <div className="page-title">History</div>
        <span className="history-count">{history.length} generations</span>
      </div>
      <div className="history-list">
        {history.map((item, i) => {
          if (!item) return null;
          return (
            <div key={i} className="history-card" onClick={() => onSelect(item)}>
              <div className="history-left">
                <div className="history-icon">📦</div>
                <div>
                  <div className="history-repo">{item.owner}/{item.repoName}</div>
                  <div className="history-stack">
                    {item.summary?.detectedStack || item.detectedStack || 'Unknown stack'}
                  </div>
                </div>
              </div>
              <div className="history-right">
                <span className="history-date">
                  {new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                <div className="history-arrow">→</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
