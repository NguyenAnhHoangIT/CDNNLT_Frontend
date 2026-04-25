export default function Header({
    isHouseLoaded,
    selectedItem,
    transformMode,
    gridActive,
    onAddFurniture,
    onResetCamera,
    onToggleGrid,
    onChangeTransformMode,
}) {
    return (
        <header id="header">
            <div className="header-left">
                <div className="logo">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                            </linearGradient>
                        </defs>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <h1>Room Designer</h1>
                </div>
            </div>

            <div className="header-center">
                {selectedItem && (
                    <div id="transform-modes" className="transform-modes">
                        <button
                            className={`mode-btn${transformMode === 'translate' ? ' active' : ''}`}
                            title="Di chuyển (G)"
                            onClick={() => onChangeTransformMode('translate')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="5 9 2 12 5 15" />
                                <polyline points="9 5 12 2 15 5" />
                                <polyline points="15 19 12 22 9 19" />
                                <polyline points="19 9 22 12 19 15" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <line x1="12" y1="2" x2="12" y2="22" />
                            </svg>
                            <span>Move</span>
                        </button>
                        <button
                            className={`mode-btn${transformMode === 'rotate' ? ' active' : ''}`}
                            title="Xoay (R)"
                            onClick={() => onChangeTransformMode('rotate')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.5 2v6h-6" />
                                <path d="M21.34 15.57a10 10 0 1 1-.57-8.38" />
                            </svg>
                            <span>Rotate</span>
                        </button>
                        <button
                            className={`mode-btn${transformMode === 'scale' ? ' active' : ''}`}
                            title="Phóng to/thu nhỏ (C)"
                            onClick={() => onChangeTransformMode('scale')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                            <span>Scale</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="header-right">
                {isHouseLoaded && (
                    <>
                        <button
                            className="header-btn accent-btn"
                            title="Thêm nội thất"
                            onClick={onAddFurniture}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Thêm nội thất</span>
                        </button>
                        <div className="header-divider"></div>
                    </>
                )}
                <button
                    className="header-btn"
                    title="Reset Camera"
                    disabled={!isHouseLoaded}
                    onClick={onResetCamera}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    <span>Reset</span>
                </button>
                <button
                    className={`header-btn${gridActive ? ' active' : ''}`}
                    title="Toggle Grid"
                    onClick={onToggleGrid}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                    </svg>
                    <span>Grid</span>
                </button>
            </div>
        </header>
    );
}
