import { useState } from 'react';
import FurnitureItem from './FurnitureItem';

export default function FurniturePanel({
    furnitureList,
    selectedItem,
    onSelect,
    onDuplicate,
    onDelete,
    onUploadTexture,
}) {
    const [isSystemOpen, setIsSystemOpen] = useState(true);

    const systemItems = [
        { id: 'sys-floor', name: 'Sàn nhà', isSystem: true, fileSize: 0 },
        { id: 'sys-wall', name: 'Tường nhà', isSystem: true, fileSize: 0 }
    ];

    return (
        <div id="furniture-panel">
            <div className="panel-header">
                <h3>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
                    </svg>
                    Danh sách các phần
                </h3>
                <span className="badge">{furnitureList.length}</span>
            </div>
            <div className="panel-body" id="furniture-list" style={{ padding: 0 }}>
                {/* System items as collapsible Dropdown */}
                <div className="furniture-group">
                    <div 
                        className="group-header" 
                        onClick={() => setIsSystemOpen(!isSystemOpen)}
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            cursor: 'pointer', 
                            padding: '12px 16px', 
                            backgroundColor: 'rgba(0,0,0,0.02)', 
                            borderBottom: '1px solid var(--border-color)', 
                            fontWeight: 600, 
                            fontSize: '0.85rem', 
                            color: 'var(--text-secondary)' 
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                            Cấu trúc phòng
                        </span>
                        <svg 
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transform: isSystemOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                    {isSystemOpen && (
                        <div className="group-content" style={{ padding: '8px', borderBottom: '1px solid var(--border-color)' }}>
                            {systemItems.map(item => (
                                <FurnitureItem
                                    key={item.id}
                                    item={item}
                                    isSelected={false} // Never selected
                                    onSelect={() => onUploadTexture(item.id)} // Click row to upload
                                    onDuplicate={onDuplicate}
                                    onDelete={onDelete}
                                    onUploadTexture={onUploadTexture}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Normal furniture items */}
                <div className="furniture-group">
                    <div className="group-header" style={{ padding: '12px 16px 8px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
                        </svg>
                        Đồ nội thất ({furnitureList.length})
                    </div>
                    
                    <div style={{ padding: '0 8px 8px 8px' }}>
                        {furnitureList.length === 0 ? (
                            <div className="empty-state" style={{ marginTop: '16px' }}>
                                <p>Chưa có nội thất nào</p>
                                <p className="text-muted">Nhấn "Thêm nội thất" để bắt đầu</p>
                            </div>
                        ) : (
                            furnitureList.map(item => (
                                <FurnitureItem
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedItem?.id === item.id}
                                    onSelect={onSelect}
                                    onDuplicate={onDuplicate}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
