import { formatFileSize } from '../engine/roomEngine';

export default function FurnitureItem({ item, isSelected, onSelect, onDuplicate, onDelete, onUploadTexture }) {
    return (
        <div
            className={`furniture-item${isSelected ? ' selected' : ''}${item.isSystem ? ' system-item' : ''}`}
            data-id={item.id}
            onClick={() => onSelect(item.id)}
        >
            <div className="furniture-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
            </div>
            <div className="furniture-item-info">
                <div className="furniture-item-name">{item.name}</div>
                {!item.isSystem && (
                    <div className="furniture-item-meta">{formatFileSize(item.fileSize)}</div>
                )}
            </div>
            <div className="furniture-item-actions">
                {item.isSystem ? (
                    <button
                        className="item-btn"
                        title="Tải ảnh bề mặt"
                        onClick={(e) => { e.stopPropagation(); onUploadTexture(item.id); }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M20.4 14.5L16 10 4 20" />
                        </svg>
                    </button>
                ) : (
                    <>
                        <button
                            className="item-btn"
                            title="Nhân đôi"
                            onClick={(e) => { e.stopPropagation(); onDuplicate(item.id); }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>
                        <button
                            className="item-btn danger"
                            title="Xóa"
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
