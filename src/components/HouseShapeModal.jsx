import { useState, useEffect, useCallback } from 'react';

const HOUSE_SHAPES = [
    {
        id: 'square',
        name: 'Hình vuông',
        description: 'Bố cục đơn giản, tối ưu diện tích',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="60" height="60" rx="4" stroke="currentColor" strokeWidth="2.5" />
                <rect x="30" y="55" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                <rect x="16" y="20" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <rect x="50" y="20" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
        ),
    },
    {
        id: 'l-shape',
        name: 'Chữ L',
        description: 'Chia tách không gian linh hoạt',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 10h60v30H40v30H10V10z" rx="4" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <rect x="16" y="16" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <rect x="20" y="50" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
        ),
    },
    {
        id: 'u-shape',
        name: 'Chữ U',
        description: 'Sân trong rộng rãi, thông thoáng',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 10h20v40h20V10h20v60H10V10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <rect x="16" y="16" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <rect x="56" y="16" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
        ),
    },
    {
        id: 't-shape',
        name: 'Chữ T',
        description: 'Thiết kế hiện đại, tạo điểm nhấn',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 10h60v25H50v35H30V35H10V10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <rect x="36" y="45" width="8" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <rect x="16" y="16" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
        ),
    },
    {
        id: 'custom',
        name: 'Tải file .glb',
        description: 'Tải mô hình 3D từ máy tính',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10H20a4 4 0 00-4 4v52a4 4 0 004 4h40a4 4 0 004-4V24L50 10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M50 10v14h14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="32" y1="44" x2="48" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <polyline points="40,36 40,52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <polyline points="35,41 40,36 45,41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

export default function HouseShapeModal({ isOpen, onClose, onSelect }) {
    const [selected, setSelected] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [step, setStep] = useState(1); // 1 = chọn hình, 2 = nhập kích thước
    const [dimMode, setDimMode] = useState('lw'); // 'lw' = dài x rộng, 'area' = diện tích
    const [length, setLength] = useState(8);
    const [width, setWidth] = useState(8);
    const [area, setArea] = useState(64);

    useEffect(() => {
        if (isOpen) {
            setSelected(null);
            setIsClosing(false);
            setStep(1);
            setDimMode('lw');
            setLength(8);
            setWidth(8);
            setArea(64);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 250);
    };

    const handleSelectShape = (shape) => {
        setSelected(shape.id);
        if (shape.id === 'custom') {
            // Custom doesn't need dimensions
            setTimeout(() => {
                onSelect({ ...shape, dimensions: null });
            }, 300);
        } else {
            // Go to dimension step
            setTimeout(() => {
                setStep(2);
            }, 300);
        }
    };

    const handleBack = () => {
        setStep(1);
        setSelected(null);
    };

    const handleConfirm = useCallback(() => {
        const shape = HOUSE_SHAPES.find(s => s.id === selected);
        if (!shape) return;

        let finalLength, finalWidth;

        if (dimMode === 'area') {
            // Chia diện tích thành hình vuông
            const side = Math.sqrt(Math.max(4, area));
            finalLength = parseFloat(side.toFixed(1));
            finalWidth = parseFloat(side.toFixed(1));
        } else {
            finalLength = Math.max(2, length);
            finalWidth = Math.max(2, width);
        }

        onSelect({
            ...shape,
            dimensions: { length: finalLength, width: finalWidth }
        });
    }, [selected, dimMode, area, length, width, onSelect]);

    if (!isOpen) return null;

    const selectedShape = HOUSE_SHAPES.find(s => s.id === selected);

    return (
        <div className={`modal-backdrop${isClosing ? ' closing' : ''}`} onClick={handleClose}>
            <div
                className={`modal-container${isClosing ? ' closing' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#modalIconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <linearGradient id="modalIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                        <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                                    </linearGradient>
                                </defs>
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="modal-title">{step === 1 ? 'Chọn kiểu nhà' : 'Nhập kích thước'}</h2>
                            <p className="modal-subtitle">
                                {step === 1
                                    ? 'Chọn mẫu nhà để bắt đầu thiết kế'
                                    : `Nhập kích thước cho mẫu "${selectedShape?.name}"`
                                }
                            </p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={handleClose} title="Đóng">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {step === 1 ? (
                        /* ============ STEP 1: Chọn hình ============ */
                        <div className="shape-grid">
                            {HOUSE_SHAPES.map((shape, index) => (
                                <button
                                    key={shape.id}
                                    id={`shape-${shape.id}`}
                                    className={`shape-card${selected === shape.id ? ' selected' : ''}`}
                                    onClick={() => handleSelectShape(shape)}
                                    style={{ animationDelay: `${index * 0.06}s` }}
                                >
                                    <div className="shape-icon">
                                        {shape.icon}
                                    </div>
                                    <div className="shape-info">
                                        <span className="shape-name">{shape.name}</span>
                                        <span className="shape-desc">{shape.description}</span>
                                    </div>
                                    <div className="shape-check">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* ============ STEP 2: Nhập kích thước ============ */
                        <div className="dimension-step" style={{ animation: 'shapeCardIn 0.35s ease both' }}>
                            {/* Preview shape mini */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 18px',
                                background: 'rgba(167, 139, 250, 0.06)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid rgba(167, 139, 250, 0.15)',
                                marginBottom: '24px'
                            }}>
                                <div style={{ width: '40px', height: '40px', color: 'var(--accent-purple)', flexShrink: 0 }}>
                                    {selectedShape?.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedShape?.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedShape?.description}</div>
                                </div>
                            </div>

                            {/* Toggle: Chiều dài x rộng / Diện tích */}
                            <div style={{
                                display: 'flex',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                padding: '3px',
                                marginBottom: '20px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <button
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s',
                                        background: dimMode === 'lw' ? 'var(--accent-purple)' : 'transparent',
                                        color: dimMode === 'lw' ? '#fff' : 'var(--text-secondary)',
                                    }}
                                    onClick={() => setDimMode('lw')}
                                >
                                    Chiều dài × Chiều rộng
                                </button>
                                <button
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s',
                                        background: dimMode === 'area' ? 'var(--accent-purple)' : 'transparent',
                                        color: dimMode === 'area' ? '#fff' : 'var(--text-secondary)',
                                    }}
                                    onClick={() => setDimMode('area')}
                                >
                                    Diện tích
                                </button>
                            </div>

                            {/* Input fields */}
                            {dimMode === 'lw' ? (
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)',
                                            marginBottom: '6px'
                                        }}>
                                            Chiều dài (m)
                                        </label>
                                        <input
                                            type="number"
                                            min="2"
                                            max="50"
                                            step="0.5"
                                            value={length}
                                            onChange={(e) => setLength(parseFloat(e.target.value) || 2)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1.5px solid var(--border-color)',
                                                background: 'var(--bg-tertiary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                                boxSizing: 'border-box',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        paddingBottom: '12px',
                                        color: 'var(--text-muted)',
                                        fontSize: '1.2rem',
                                        fontWeight: 700
                                    }}>×</div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)',
                                            marginBottom: '6px'
                                        }}>
                                            Chiều rộng (m)
                                        </label>
                                        <input
                                            type="number"
                                            min="2"
                                            max="50"
                                            step="0.5"
                                            value={width}
                                            onChange={(e) => setWidth(parseFloat(e.target.value) || 2)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1.5px solid var(--border-color)',
                                                background: 'var(--bg-tertiary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                                boxSizing: 'border-box',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        color: 'var(--text-secondary)',
                                        marginBottom: '6px'
                                    }}>
                                        Diện tích (m²)
                                    </label>
                                    <input
                                        type="number"
                                        min="4"
                                        max="2500"
                                        step="1"
                                        value={area}
                                        onChange={(e) => setArea(parseFloat(e.target.value) || 4)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1.5px solid var(--border-color)',
                                            background: 'var(--bg-tertiary)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            fontFamily: 'inherit',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                </div>
                            )}

                            {/* Area preview text */}
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(6, 182, 212, 0.06)',
                                border: '1px solid rgba(6, 182, 212, 0.15)',
                                fontSize: '0.82rem',
                                color: 'var(--accent-cyan)',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                {dimMode === 'lw'
                                    ? `Diện tích ≈ ${(length * width).toFixed(1)} m² — Kích thước ${length}m × ${width}m`
                                    : `Kích thước ≈ ${Math.sqrt(Math.max(4, area)).toFixed(1)}m × ${Math.sqrt(Math.max(4, area)).toFixed(1)}m`
                                }
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={handleBack}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1.5px solid var(--border-color)',
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.88rem',
                                        fontWeight: 600,
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    style={{
                                        flex: 2,
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                                        color: '#fff',
                                        fontSize: '0.88rem',
                                        fontWeight: 700,
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 16px rgba(167, 139, 250, 0.3)',
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Tạo phòng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
