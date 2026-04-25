import { useCallback } from 'react';

const PRESETS = [50, 75, 100, 150, 200];

export default function ResizePanel({ selectedItem, scale, uniformScale, onApplyResize, onResetSize, onToggleUniformScale }) {
    if (!selectedItem) return null;

    const handleSlider = useCallback((axis, val) => onApplyResize(axis, parseInt(val)), [onApplyResize]);
    const handleInput = useCallback((axis, val) => { const n = parseInt(val); if (!isNaN(n) && n > 0) onApplyResize(axis, n); }, [onApplyResize]);
    const avg = Math.round((scale.x + scale.y + scale.z) / 3);

    return (
        <div id="resize-panel">
            <div className="resize-header">
                <h4>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    Resize
                </h4>
                <button className={`lock-btn${uniformScale ? ' active' : ''}`} title="Uniform Scale" onClick={onToggleUniformScale}>
                    {uniformScale ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
                    )}
                </button>
            </div>
            <div className="resize-inputs">
                {['x', 'y', 'z'].map(axis => (
                    <div className="resize-axis" key={axis}>
                        <label className={`axis-label axis-${axis}`}>{axis.toUpperCase()}</label>
                        <input type="range" className="resize-slider" min="10" max="500" value={Math.min(Math.max(scale[axis], 10), 500)} step="1" onChange={e => handleSlider(axis, e.target.value)} />
                        <input type="number" className="resize-input" value={scale[axis]} min="1" max="999" step="1" onChange={e => handleInput(axis, e.target.value)} />
                        <span className="resize-unit">%</span>
                    </div>
                ))}
            </div>
            <div className="resize-presets">
                {PRESETS.map(pct => (
                    <button key={pct} className={`preset-btn${avg === pct ? ' active' : ''}`} onClick={() => onApplyResize('x', pct)}>{pct}%</button>
                ))}
            </div>
            <button className="reset-size-btn" onClick={onResetSize}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                Reset kích thước
            </button>
        </div>
    );
}
