import React from 'react';

const COLORS = {
  node: '#68a063', nodejs: '#68a063', express: '#68a063',
  python: '#3776ab', fastapi: '#009688', django: '#44b78b',
  react: '#61dafb', nextjs: '#aaaaaa', vite: '#646cff',
  postgres: '#336791', postgresql: '#336791', mysql: '#4479a1',
  redis: '#dc382d', nginx: '#009900', docker: '#2496ed',
  go: '#00add8', rust: '#ce422b', java: '#ed8b00', ruby: '#cc342d',
};

export default function StackBadge({ label }) {
  const color = COLORS[label?.toLowerCase()] || '#6b7280';
  return (
    <span className="badge" style={{ borderColor: color, color }}>
      {label}
    </span>
  );
}
