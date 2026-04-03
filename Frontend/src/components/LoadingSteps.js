import React from 'react';

export default function LoadingSteps({ steps, currentStep }) {
  return (
    <div className="loading-card">
      <div className="loading-head">
        <div className="spinner" />
        <div>
          <div className="loading-title">Analyzing your repository…</div>
          <div className="loading-sub">Reading files, detecting stack, generating configs</div>
        </div>
      </div>
      <div className="steps">
        {steps.map((label, i) => {
          const state = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
          return (
            <div key={i} className={`step-item ${state}`}>
              <div className="step-check">
                {i < currentStep ? '✓' : i === currentStep ? '·' : ''}
              </div>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
