import { useState, useEffect } from 'react';

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

    useEffect(() => {
        if (isOpen) {
            setSelected(null);
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 250);
    };

    const handleSelect = (shape) => {
        setSelected(shape.id);
        // Small delay to show selection animation
        setTimeout(() => {
            onSelect(shape);
        }, 300);
    };

    if (!isOpen) return null;

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
                            <h2 className="modal-title">Chọn kiểu nhà</h2>
                            <p className="modal-subtitle">Chọn mẫu nhà để bắt đầu thiết kế</p>
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
                    <div className="shape-grid">
                        {HOUSE_SHAPES.map((shape, index) => (
                            <button
                                key={shape.id}
                                id={`shape-${shape.id}`}
                                className={`shape-card${selected === shape.id ? ' selected' : ''}`}
                                onClick={() => handleSelect(shape)}
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
                </div>
            </div>
        </div>
    );
}
