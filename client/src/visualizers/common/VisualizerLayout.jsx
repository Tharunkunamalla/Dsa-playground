import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './VisualizerLayout.css';

const VisualizerLayout = ({ title, children, complexity, activityLog, onReset }) => {
  return (
    <div className="viz-container animate-fade-in">
      <div className="viz-header">
        <div className="viz-breadcrumbs">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-curr">{title}</span>
        </div>
        <Link to="/" className="back-btn">
          <FaArrowLeft /> Back
        </Link>
      </div>

      <div className="viz-grid">
        {/* Left Panel: Controls */}
        <div className="viz-panel controls-panel glass-card">
          <div className="panel-header">
            <h3>Controls</h3>
            {onReset && <button onClick={onReset} className="reset-btn">Reset</button>}
          </div>
          <div className="controls-content">
            {children && children[0]} 
          </div>
        </div>

        {/* Center Panel: Canvas */}
        <div className="viz-panel canvas-panel glass-card">
          <div className="canvas-content">
            {children && children[1]} 
          </div>
        </div>

        {/* Right Panel: Info */}
        <div className="viz-panel info-panel">
          <div className="glass-card complexity-card">
            <h3>Complexity</h3>
            <div className="complexity-content">
              {complexity ? (
                typeof complexity === 'string' ? (
                  <p>{complexity}</p>
                ) : (
                  <div className="complexity-details">
                    <div><span className="complexity-label">Operation:</span> {complexity.operation}</div>
                    <div><span className="complexity-label">Time:</span> {complexity.time}</div>
                    <div><span className="complexity-label">Space:</span> {complexity.space}</div>
                  </div>
                )
              ) : (
                <p className="text-muted">Run an operation to see its complexity.</p>
              )}
            </div>
          </div>
          
          <div className="glass-card activity-card">
            <h3>Activity</h3>
            <div className="activity-list">
              {activityLog && activityLog.length > 0 ? (
                activityLog.map((log, idx) => (
                  <div key={idx} className="activity-item animate-fade-in">
                    {log}
                  </div>
                ))
              ) : (
                <p className="text-muted">No operations yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerLayout;
