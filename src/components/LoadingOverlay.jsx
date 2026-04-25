export default function LoadingOverlay({ isLoading, text, percent }) {
    if (!isLoading) return null;

    return (
        <div id="loading-overlay">
            <div className="loader">
                <div className="loader-ring"></div>
                <p>{text || 'Đang tải model...'}</p>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
                <span className="progress-text">{percent}%</span>
            </div>
        </div>
    );
}
