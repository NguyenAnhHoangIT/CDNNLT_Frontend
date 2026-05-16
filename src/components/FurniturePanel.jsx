import { useState } from 'react';
import FurnitureItem from './FurnitureItem';

export default function FurniturePanel({
    furnitureList,
    selectedItem,
    onSelect,
    onDuplicate,
    onDelete,
}) {

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
