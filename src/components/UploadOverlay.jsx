import { useRef, useCallback } from 'react';

export default function UploadOverlay({ onFileSelected }) {
    const fileInputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.currentTarget.querySelector('.upload-zone')?.classList.add('drag-over');
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.currentTarget.querySelector('.upload-zone')?.classList.remove('drag-over');
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.currentTarget.querySelector('.upload-zone')?.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
            onFileSelected(file);
        }
    }, [onFileSelected]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) onFileSelected(file);
        e.target.value = '';
    }, [onFileSelected]);

    return (
        <div
            id="upload-overlay"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#uploadGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                            <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                            </linearGradient>
                        </defs>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <h2>Tải file Nhà (.glb)</h2>
                <p>Kéo thả hoặc click để chọn file căn nhà</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb,.gltf"
                    hidden
                    onChange={handleFileChange}
                />
                <button
                    className="btn-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Chọn file Nhà
                </button>
            </div>
        </div>
    );
}
