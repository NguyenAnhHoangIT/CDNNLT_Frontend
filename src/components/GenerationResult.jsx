import { useState } from 'react';
import './GenerationResult.css';
import RoomViewer from './RoomViewer';

export default function GenerationResult({ result, onReset }) {
    const [copySuccess, setCopySuccess] = useState(false);

    if (!result) return null;

    const glbUrl = `http://localhost:8888/${result.path}`;

    const handleCopyPath = () => {
        navigator.clipboard.writeText(result.path);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="generation-result">
            <div className="result-container">
                <div className="result-header">
                    <div className="success-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Tạo thành công!
                    </div>
                    <button className="reset-btn" onClick={onReset}>Tạo lại</button>
                </div>

                <div className="result-preview">
                    <RoomViewer modelUrl={glbUrl} />
                </div>

                <div className="result-actions">
                    <a href={glbUrl} download className="action-btn download-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Tải về .GLB
                    </a>

                    <button className="action-btn secondary-btn" onClick={handleCopyPath}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        {copySuccess ? 'Đã sao chép!' : 'Sao chép đường dẫn'}
                    </button>
                </div>

                <div className="result-note">
                    <p>Mẹo: Bạn có thể kéo file này vào <strong>3D Editor</strong> để bố trí trong không gian phòng.</p>
                </div>
            </div>
        </div>
    );
}
