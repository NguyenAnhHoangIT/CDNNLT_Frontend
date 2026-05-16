import { useState, useEffect } from 'react';
import './DesignPages.css';
import './OptionConfig.css';

const API_BASE = 'http://localhost:8888';

export default function OptionConfigPage() {
    const [objects, setObjects] = useState([]);
    const [styles, setStyles] = useState([]);
    const [activeTab, setActiveTab] = useState('objects');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form states
    const [newObjectName, setNewObjectName] = useState('');
    const [newStyleName, setNewStyleName] = useState('');
    const [newStylePrompt, setNewStylePrompt] = useState('');

    // Edit states
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPrompt, setEditPrompt] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [objRes, styleRes] = await Promise.all([
                fetch(`${API_BASE}/option/objects`),
                fetch(`${API_BASE}/option/styles`)
            ]);
            setObjects(await objRes.json());
            setStyles(await styleRes.json());
        } catch (err) {
            setError('Không thể tải dữ liệu. Vui lòng kiểm tra backend.');
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 3000);
    };

    // ─── Object CRUD ───
    const handleAddObject = async (e) => {
        e.preventDefault();
        if (!newObjectName.trim()) return;
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/option/objects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newObjectName.trim() })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Lỗi khi thêm');
            }
            setNewObjectName('');
            fetchData();
            showSuccess(`Đã thêm đối tượng "${newObjectName.trim()}"`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteObject = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
        try {
            await fetch(`${API_BASE}/option/objects/${id}`, { method: 'DELETE' });
            fetchData();
            showSuccess(`Đã xóa đối tượng "${name}"`);
        } catch (err) {
            setError('Lỗi khi xóa');
        }
    };

    const handleEditObject = async (id) => {
        if (!editName.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/option/objects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName.trim() })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Lỗi khi cập nhật');
            }
            setEditingId(null);
            fetchData();
            showSuccess('Đã cập nhật thành công');
        } catch (err) {
            setError(err.message);
        }
    };

    // ─── Style CRUD ───
    const handleAddStyle = async (e) => {
        e.preventDefault();
        if (!newStyleName.trim() || !newStylePrompt.trim()) return;
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/option/styles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newStyleName.trim(), prompt: newStylePrompt.trim() })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Lỗi khi thêm');
            }
            setNewStyleName('');
            setNewStylePrompt('');
            fetchData();
            showSuccess(`Đã thêm phong cách "${newStyleName.trim()}"`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteStyle = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
        try {
            await fetch(`${API_BASE}/option/styles/${id}`, { method: 'DELETE' });
            fetchData();
            showSuccess(`Đã xóa phong cách "${name}"`);
        } catch (err) {
            setError('Lỗi khi xóa');
        }
    };

    const handleEditStyle = async (id) => {
        if (!editName.trim() || !editPrompt.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/option/styles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName.trim(), prompt: editPrompt.trim() })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Lỗi khi cập nhật');
            }
            setEditingId(null);
            fetchData();
            showSuccess('Đã cập nhật thành công');
        } catch (err) {
            setError(err.message);
        }
    };

    const startEdit = (item, type) => {
        setEditingId(`${type}-${item.id}`);
        setEditName(item.name);
        if (type === 'style') setEditPrompt(item.prompt);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditPrompt('');
    };

    if (loading) {
        return (
            <div className="design-page">
                <div className="page-header">
                    <h1>Quản lý tùy chọn</h1>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="design-page">
            <div className="page-header">
                <h1>Quản lý tùy chọn</h1>
                <p>Thêm, sửa, xóa các đối tượng nội thất và phong cách thiết kế.</p>
            </div>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message" style={{ maxWidth: 800, margin: '0 auto 24px' }}>{error}</div>}

            <div className="config-container">
                {/* Tab Switcher */}
                <div className="config-tabs">
                    <button
                        className={`config-tab ${activeTab === 'objects' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('objects'); cancelEdit(); }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Đối tượng ({objects.length})
                    </button>
                    <button
                        className={`config-tab ${activeTab === 'styles' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('styles'); cancelEdit(); }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="13.5" cy="6.5" r="2.5" />
                            <path d="M17.1 11.2A6 6 0 0 1 21 17H3a6 6 0 0 1 3.9-5.8" />
                        </svg>
                        Phong cách ({styles.length})
                    </button>
                </div>

                {/* Objects Tab */}
                {activeTab === 'objects' && (
                    <div className="config-section">
                        <form className="config-add-form" onSubmit={handleAddObject}>
                            <input
                                type="text"
                                className="config-input"
                                placeholder="Tên đối tượng mới (VD: Desk, Mirror...)"
                                value={newObjectName}
                                onChange={(e) => setNewObjectName(e.target.value)}
                            />
                            <button type="submit" className="config-add-btn" disabled={!newObjectName.trim()}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Thêm
                            </button>
                        </form>

                        <div className="config-list">
                            {objects.map(obj => (
                                <div key={obj.id} className="config-item">
                                    {editingId === `object-${obj.id}` ? (
                                        <div className="config-edit-row">
                                            <input
                                                type="text"
                                                className="config-input"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                autoFocus
                                            />
                                            <button className="config-save-btn" onClick={() => handleEditObject(obj.id)}>Lưu</button>
                                            <button className="config-cancel-btn" onClick={cancelEdit}>Hủy</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="config-item-info">
                                                <span className="config-item-id">#{obj.id}</span>
                                                <span className="config-item-name">{obj.name}</span>
                                            </div>
                                            <div className="config-item-actions">
                                                <button className="config-edit-btn" onClick={() => startEdit(obj, 'object')} title="Sửa">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button className="config-delete-btn" onClick={() => handleDeleteObject(obj.id, obj.name)} title="Xóa">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Styles Tab */}
                {activeTab === 'styles' && (
                    <div className="config-section">
                        <form className="config-add-form config-add-form-col" onSubmit={handleAddStyle}>
                            <div className="config-add-row">
                                <input
                                    type="text"
                                    className="config-input"
                                    placeholder="Tên phong cách (VD: Bohemian, Art Deco...)"
                                    value={newStyleName}
                                    onChange={(e) => setNewStyleName(e.target.value)}
                                />
                            </div>
                            <div className="config-add-row">
                                <input
                                    type="text"
                                    className="config-input"
                                    placeholder="Prompt mô tả (VD: bohemian style, eclectic colors, woven textures)"
                                    value={newStylePrompt}
                                    onChange={(e) => setNewStylePrompt(e.target.value)}
                                />
                                <button type="submit" className="config-add-btn" disabled={!newStyleName.trim() || !newStylePrompt.trim()}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Thêm
                                </button>
                            </div>
                        </form>

                        <div className="config-list">
                            {styles.map(s => (
                                <div key={s.id} className="config-item">
                                    {editingId === `style-${s.id}` ? (
                                        <div className="config-edit-col">
                                            <input
                                                type="text"
                                                className="config-input"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                placeholder="Tên phong cách"
                                                autoFocus
                                            />
                                            <input
                                                type="text"
                                                className="config-input"
                                                value={editPrompt}
                                                onChange={(e) => setEditPrompt(e.target.value)}
                                                placeholder="Prompt mô tả"
                                            />
                                            <div className="config-edit-actions">
                                                <button className="config-save-btn" onClick={() => handleEditStyle(s.id)}>Lưu</button>
                                                <button className="config-cancel-btn" onClick={cancelEdit}>Hủy</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="config-item-info">
                                                <span className="config-item-id">#{s.id}</span>
                                                <div className="config-style-detail">
                                                    <span className="config-item-name">{s.name}</span>
                                                    <span className="config-item-prompt">{s.prompt}</span>
                                                </div>
                                            </div>
                                            <div className="config-item-actions">
                                                <button className="config-edit-btn" onClick={() => startEdit(s, 'style')} title="Sửa">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button className="config-delete-btn" onClick={() => handleDeleteStyle(s.id, s.name)} title="Xóa">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
