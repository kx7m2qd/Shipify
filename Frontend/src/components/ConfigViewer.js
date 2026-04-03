import React, { useState } from 'react';

const TABS = [
  { key: 'dockerfile',    label: 'Dockerfile',     file: 'Dockerfile',                   icon: '🐳' },
  { key: 'dockerCompose', label: 'Compose',         file: 'docker-compose.yml',           icon: '🔧' },
  { key: 'githubActions', label: 'CI/CD',           file: '.github/workflows/deploy.yml', icon: '⚙️' },
  { key: 'nginxConf',     label: 'nginx.conf',      file: 'nginx.conf',                   icon: '🌐' },
  { key: 'envExample',    label: '.env.example',    file: '.env.example',                 icon: '🔑' },
];

export default function ConfigViewer({ configs, repoName }) {
  const [activeTab, setActiveTab] = useState('dockerfile');
  const [copied,    setCopied]    = useState(false);

  const available  = TABS.filter(t => configs?.[t.key]);
  const activeConf = TABS.find(t => t.key === activeTab);
  const activeCode = configs?.[activeTab] || '';

  // If current tab was removed, fall back to first available
  const resolvedTab = available.find(t => t.key === activeTab) ? activeTab : available[0]?.key;

  const download = (key, filename) => {
    const content = configs[key];
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    available.forEach((t, i) => setTimeout(() => download(t.key, t.file), i * 200));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(configs[resolvedTab] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentConf = TABS.find(t => t.key === resolvedTab);

  return (
    <div className="viewer">
      <div className="tabs-bar">
        <div className="tab-list">
          {available.map(t => (
            <button
              key={t.key}
              className={`tab-btn ${resolvedTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <button className="dl-all-btn" onClick={downloadAll}>
          ↓ All files
        </button>
      </div>

      <div className="code-toolbar">
        <span className="code-filename">
          <span className="code-dot" />
          {currentConf?.file}
        </span>
        <div className="code-actions">
          <button className={`code-action-btn ${copied ? 'copied' : ''}`} onClick={copy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            className="code-action-btn"
            onClick={() => download(resolvedTab, currentConf?.file)}
          >
            ↓ Download
          </button>
        </div>
      </div>

      <pre className="code-block">
        <code>{configs[resolvedTab]}</code>
      </pre>
    </div>
  );
}
