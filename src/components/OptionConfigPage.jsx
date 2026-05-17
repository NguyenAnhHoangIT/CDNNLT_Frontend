import { useCallback, useEffect, useState } from 'react';
import { API_BASE, parseBackendResponse } from '../api/backend';
import './DesignPages.css';
import './OptionConfig.css';

const emptyDocumentForm = {
    name: '',
    style: '',
    document_path: '',
};

const supportedDocumentExtensions = ['.txt', '.docx'];
const supportedDocumentAccept = supportedDocumentExtensions.join(',');

export default function OptionConfigPage() {
    const [objects, setObjects] = useState([]);
    const [styles, setStyles] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [activeTab, setActiveTab] = useState('objects');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingTarget, setUploadingTarget] = useState(null);
    const [generatingStyleId, setGeneratingStyleId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [newObjectName, setNewObjectName] = useState('');
    const [newStyleName, setNewStyleName] = useState('');
    const [newStylePrompt, setNewStylePrompt] = useState('');
    const [newDocument, setNewDocument] = useState(emptyDocumentForm);

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPrompt, setEditPrompt] = useState('');
    const [editDocument, setEditDocument] = useState(emptyDocumentForm);

    const requestOption = async (path, options) => {
        const response = await fetch(`${API_BASE}/option${path}`, options);
        return parseBackendResponse(response);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [objectData, styleData, documentData] = await Promise.all([
                requestOption('/objects'),
                requestOption('/styles'),
                requestOption('/documents'),
            ]);
            setObjects(objectData);
            setStyles(styleData);
            setDocuments(documentData);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu. Vui lòng kiểm tra backend.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 3000);
    };

    const resetEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditPrompt('');
        setEditDocument(emptyDocumentForm);
    };

    const runMutation = async (action, successMessage) => {
        setSaving(true);
        setError(null);
        try {
            await action();
            await fetchData();
            resetEdit();
            showSuccess(successMessage);
        } catch (err) {
            setError(err.message || 'Thao tác thất bại. Vui lòng kiểm tra backend.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddObject = async (e) => {
        e.preventDefault();
        const name = newObjectName.trim();
        if (!name) return;

        await runMutation(async () => {
            await requestOption('/objects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            setNewObjectName('');
        }, `Đã thêm đối tượng "${name}"`);
    };

    const handleEditObject = async (id) => {
        const name = editName.trim();
        if (!name) return;

        await runMutation(() => requestOption(`/objects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        }), 'Đã cập nhật đối tượng');
    };

    const handleDeleteObject = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;

        await runMutation(() => requestOption(`/objects/${id}`, { method: 'DELETE' }), `Đã xóa đối tượng "${name}"`);
    };

    const handleAddStyle = async (e, shouldGeneratePrompt = false) => {
        e.preventDefault();
        const name = newStyleName.trim();
        const prompt = newStylePrompt.trim();
        if (!name || (!prompt && !shouldGeneratePrompt)) return;

        await runMutation(async () => {
            const createdStyle = await requestOption('/styles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, prompt }),
            });
            if (shouldGeneratePrompt) {
                await requestOption(`/styles/${createdStyle.id}/generate-prompt`, { method: 'POST' });
            }
            setNewStyleName('');
            setNewStylePrompt('');
        }, shouldGeneratePrompt ? `Đã thêm và tạo prompt cho "${name}"` : `Đã thêm phong cách "${name}"`);
    };

    const handleEditStyle = async (id) => {
        const name = editName.trim();
        const prompt = editPrompt.trim();
        if (!name || !prompt) return;

        await runMutation(() => requestOption(`/styles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, prompt }),
        }), 'Đã cập nhật phong cách');
    };

    const handleDeleteStyle = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;

        await runMutation(() => requestOption(`/styles/${id}`, { method: 'DELETE' }), `Đã xóa phong cách "${name}"`);
    };

    const handleGenerateStylePrompt = async (id, name) => {
        setGeneratingStyleId(id);
        await runMutation(
            () => requestOption(`/styles/${id}/generate-prompt`, { method: 'POST' }),
            `Đã tạo prompt cho "${name}"`
        );
        setGeneratingStyleId(null);
    };

    const cleanDocumentForm = (form) => ({
        name: form.name.trim(),
        style: form.style.trim(),
        document_path: form.document_path.trim(),
    });

    const isDocumentFormValid = (form) => {
        const cleaned = cleanDocumentForm(form);
        return cleaned.name && cleaned.style && cleaned.document_path;
    };

    const handleAddDocument = async (e) => {
        e.preventDefault();
        const payload = cleanDocumentForm(newDocument);
        if (!isDocumentFormValid(newDocument)) return;

        await runMutation(async () => {
            await requestOption('/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setNewDocument(emptyDocumentForm);
        }, `Đã thêm tài liệu "${payload.name}"`);
    };

    const handleEditDocument = async (id) => {
        const payload = cleanDocumentForm(editDocument);
        if (!isDocumentFormValid(editDocument)) return;

        await runMutation(() => requestOption(`/documents/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }), 'Đã cập nhật tài liệu');
    };

    const handleDeleteDocument = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa tài liệu "${name}"?`)) return;

        await runMutation(() => requestOption(`/documents/${id}`, { method: 'DELETE' }), `Đã xóa tài liệu "${name}"`);
    };

    const handleReindexDocument = async (id, name) => {
        await runMutation(() => requestOption(`/documents/${id}/reindex`, { method: 'POST' }), `Đã reindex tài liệu "${name}"`);
    };

    const handleUploadDocumentFile = async (file, setter, target) => {
        if (!file) return;
        const lowerName = file.name.toLowerCase();
        const isSupported = supportedDocumentExtensions.some(ext => lowerName.endsWith(ext));
        if (!isSupported) {
            setError(`Backend chỉ hỗ trợ tài liệu: ${supportedDocumentExtensions.join(', ')}`);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setUploadingTarget(target);
        setError(null);
        try {
            const data = await requestOption('/upload', {
                method: 'POST',
                body: formData,
            });
            setter(current => ({
                ...current,
                name: current.name || data.filename.replace(/\.[^/.]+$/, ''),
                document_path: data.file_path,
            }));
            showSuccess(`Đã upload "${data.filename}"`);
        } catch (err) {
            setError(err.message || 'Upload file thất bại. Vui lòng kiểm tra backend.');
        } finally {
            setUploadingTarget(null);
        }
    };

    const renderStyleSelect = (value, onChange, autoFocus = false) => (
        <select
            className="config-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus={autoFocus}
        >
            <option value="">Chọn phong cách</option>
            {styles.map(style => (
                <option key={style.id} value={style.name}>{style.name}</option>
            ))}
        </select>
    );

    const startEdit = (item, type) => {
        setEditingId(`${type}-${item.id}`);
        setEditName(item.name);
        setEditPrompt(type === 'style' ? item.prompt : '');
        setEditDocument(type === 'document' ? {
            name: item.name,
            style: item.style,
            document_path: item.document_path,
        } : emptyDocumentForm);
    };

    const setDocumentField = (setter, field, value) => {
        setter(current => ({ ...current, [field]: value }));
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
                <p>CRUD đối tượng nội thất, phong cách thiết kế và tài liệu knowledge base.</p>
            </div>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message" style={{ maxWidth: 960, margin: '0 auto 24px' }}>{error}</div>}

            <div className="config-container">
                <div className="config-tabs">
                    <button className={`config-tab ${activeTab === 'objects' ? 'active' : ''}`} onClick={() => { setActiveTab('objects'); resetEdit(); }}>
                        Đối tượng ({objects.length})
                    </button>
                    <button className={`config-tab ${activeTab === 'styles' ? 'active' : ''}`} onClick={() => { setActiveTab('styles'); resetEdit(); }}>
                        Phong cách ({styles.length})
                    </button>
                    <button className={`config-tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => { setActiveTab('documents'); resetEdit(); }}>
                        Tài liệu ({documents.length})
                    </button>
                </div>

                {activeTab === 'objects' && (
                    <div className="config-section">
                        <form className="config-add-form" onSubmit={handleAddObject}>
                            <input className="config-input" placeholder="Tên đối tượng mới" value={newObjectName} onChange={(e) => setNewObjectName(e.target.value)} />
                            <button type="submit" className="config-add-btn" disabled={saving || !newObjectName.trim()}>Thêm</button>
                        </form>

                        <div className="config-list">
                            {objects.map(obj => (
                                <div key={obj.id} className="config-item">
                                    {editingId === `object-${obj.id}` ? (
                                        <div className="config-edit-row">
                                            <input className="config-input" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                                            <button className="config-save-btn" disabled={saving} onClick={() => handleEditObject(obj.id)}>Lưu</button>
                                            <button className="config-cancel-btn" disabled={saving} onClick={resetEdit}>Hủy</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="config-item-info">
                                                <span className="config-item-id">#{obj.id}</span>
                                                <span className="config-item-name">{obj.name}</span>
                                            </div>
                                            <div className="config-item-actions">
                                                <button className="config-edit-btn" onClick={() => startEdit(obj, 'object')} title="Sửa">Sửa</button>
                                                <button className="config-delete-btn" onClick={() => handleDeleteObject(obj.id, obj.name)} title="Xóa">Xóa</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'styles' && (
                    <div className="config-section">
                        <form className="config-add-form config-add-form-col" onSubmit={(e) => handleAddStyle(e, false)}>
                            <input className="config-input" placeholder="Tên phong cách" value={newStyleName} onChange={(e) => setNewStyleName(e.target.value)} />
                            <div className="config-add-row">
                                <input className="config-input" placeholder="Prompt mô tả thủ công hoặc để trống để AI tạo" value={newStylePrompt} onChange={(e) => setNewStylePrompt(e.target.value)} />
                                <button type="submit" className="config-add-btn" disabled={saving || !newStyleName.trim() || !newStylePrompt.trim()}>Thêm</button>
                                <button type="button" className="config-upload-btn" disabled={saving || !newStyleName.trim()} onClick={(e) => handleAddStyle(e, true)}>
                                    Thêm & tạo prompt
                                </button>
                            </div>
                        </form>

                        <div className="config-list">
                            {styles.map(style => (
                                <div key={style.id} className="config-item">
                                    {editingId === `style-${style.id}` ? (
                                        <div className="config-edit-col">
                                            <input className="config-input" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Tên phong cách" autoFocus />
                                            <input className="config-input" value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} placeholder="Prompt mô tả" />
                                            <div className="config-edit-actions">
                                                <button className="config-save-btn" disabled={saving} onClick={() => handleEditStyle(style.id)}>Lưu</button>
                                                <button className="config-cancel-btn" disabled={saving} onClick={resetEdit}>Hủy</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="config-item-info">
                                                <span className="config-item-id">#{style.id}</span>
                                                <div className="config-style-detail">
                                                    <span className="config-item-name">{style.name}</span>
                                                    <span className="config-item-prompt">{style.prompt}</span>
                                                </div>
                                            </div>
                                            <div className="config-item-actions">
                                                <button
                                                    className="config-edit-btn"
                                                    disabled={saving || generatingStyleId === style.id}
                                                    onClick={() => handleGenerateStylePrompt(style.id, style.name)}
                                                    title="Tạo prompt bằng AI"
                                                >
                                                    {generatingStyleId === style.id ? 'Đang tạo...' : 'Tạo prompt'}
                                                </button>
                                                <button className="config-edit-btn" onClick={() => startEdit(style, 'style')} title="Sửa">Sửa</button>
                                                <button className="config-delete-btn" onClick={() => handleDeleteStyle(style.id, style.name)} title="Xóa">Xóa</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="config-section">
                        <form className="config-add-form config-add-form-col" onSubmit={handleAddDocument}>
                            <div className="config-add-row">
                                <input className="config-input" placeholder="Tên tài liệu" value={newDocument.name} onChange={(e) => setDocumentField(setNewDocument, 'name', e.target.value)} />
                                {renderStyleSelect(newDocument.style, (value) => setDocumentField(setNewDocument, 'style', value))}
                            </div>
                            <div className="config-add-row">
                                <input className="config-input" placeholder="Đường dẫn file trong backend" value={newDocument.document_path} onChange={(e) => setDocumentField(setNewDocument, 'document_path', e.target.value)} />
                                <label className={`config-upload-btn ${uploadingTarget === 'new-document' ? 'disabled' : ''}`}>
                                    {uploadingTarget === 'new-document' ? 'Đang upload...' : 'Upload file'}
                                    <input
                                        type="file"
                                        accept={supportedDocumentAccept}
                                        hidden
                                        disabled={saving || uploadingTarget === 'new-document'}
                                        onChange={(e) => {
                                            handleUploadDocumentFile(e.target.files?.[0], setNewDocument, 'new-document');
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                                <button type="submit" className="config-add-btn" disabled={saving || !isDocumentFormValid(newDocument)}>Thêm</button>
                            </div>
                        </form>

                        <div className="config-list">
                            {documents.map(doc => (
                                <div key={doc.id} className="config-item config-item-document">
                                    {editingId === `document-${doc.id}` ? (
                                        <div className="config-edit-col">
                                            <div className="config-add-row">
                                                <input className="config-input" value={editDocument.name} onChange={(e) => setDocumentField(setEditDocument, 'name', e.target.value)} placeholder="Tên tài liệu" autoFocus />
                                                {renderStyleSelect(editDocument.style, (value) => setDocumentField(setEditDocument, 'style', value))}
                                            </div>
                                            <div className="config-add-row">
                                                <input className="config-input" value={editDocument.document_path} onChange={(e) => setDocumentField(setEditDocument, 'document_path', e.target.value)} placeholder="Đường dẫn file" />
                                                <label className={`config-upload-btn ${uploadingTarget === `edit-document-${doc.id}` ? 'disabled' : ''}`}>
                                                    {uploadingTarget === `edit-document-${doc.id}` ? 'Đang upload...' : 'Upload file'}
                                                    <input
                                                        type="file"
                                                        accept={supportedDocumentAccept}
                                                        hidden
                                                        disabled={saving || uploadingTarget === `edit-document-${doc.id}`}
                                                        onChange={(e) => {
                                                            handleUploadDocumentFile(e.target.files?.[0], setEditDocument, `edit-document-${doc.id}`);
                                                            e.target.value = '';
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                            <div className="config-edit-actions">
                                                <button className="config-save-btn" disabled={saving || !isDocumentFormValid(editDocument)} onClick={() => handleEditDocument(doc.id)}>Lưu</button>
                                                <button className="config-cancel-btn" disabled={saving} onClick={resetEdit}>Hủy</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="config-item-info">
                                                <span className="config-item-id">#{doc.id}</span>
                                                <div className="config-style-detail">
                                                    <span className="config-item-name">{doc.name}</span>
                                                    <span className="config-item-prompt">style: {doc.style} | id: {doc.id}</span>
                                                    <span className="config-item-prompt">{doc.document_path}</span>
                                                </div>
                                            </div>
                                            <div className="config-item-actions config-document-actions">
                                                <button className="config-edit-btn" disabled={saving} onClick={() => handleReindexDocument(doc.id, doc.name)} title="Reindex">Reindex</button>
                                                <button className="config-edit-btn" disabled={saving} onClick={() => startEdit(doc, 'document')} title="Sửa">Sửa</button>
                                                <button className="config-delete-btn" disabled={saving} onClick={() => handleDeleteDocument(doc.id, doc.name)} title="Xóa">Xóa</button>
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
