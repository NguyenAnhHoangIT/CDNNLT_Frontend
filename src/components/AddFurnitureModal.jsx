import { useState, useRef } from 'react';
import './DesignPages.css';

const OBJECTS = ['Sofa', 'Chair', 'Table', 'Bed', 'Bookshelf', 'Cabinet', 'Lamp', 'Plant Pot'];
const STYLES = ['Modern', 'Classic', 'Minimalist', 'Industrial', 'Scandinavian', 'Vintage'];

export default function AddFurnitureModal({ isOpen, onClose, onUploadLocal, onLoadGeneratedModel }) {
    const [isClosing, setIsClosing] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState(null);

    // Form states
    const [object, setObject] = useState(OBJECTS[0]);
    const [style, setStyle] = useState(STYLES[0]);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            setStep(1);
            setSelectedMethod(null);
            setError(null);
        }, 250);
    };

    const handleMethodSelect = (method) => {
        if (method === 'local') {
            onUploadLocal();
            handleClose();
            return;
        }
        setSelectedMethod(method);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setSelectedMethod(null);
        setError(null);
    };

    const handlePhotoChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);

        try {
            let response, data;

            if (selectedMethod === 'choice') {
                response = await fetch('http://localhost:8888/model/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ object, style: style.toLowerCase() })
                });
            } else if (selectedMethod === 'describe') {
                if (!description.trim()) {
                    setError('Vui lòng nhập mô tả.');
                    setLoading(false);
                    return;
                }
                response = await fetch('http://localhost:8888/model/generate_custom', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ description })
                });
            } else if (selectedMethod === 'photo') {
                if (!file) {
                    setError('Vui lòng chọn một tấm ảnh.');
                    setLoading(false);
                    return;
                }
                const formData = new FormData();
                formData.append('file', file);
                response = await fetch('http://localhost:8888/model/generate_from_image', {
                    method: 'POST',
                    body: formData
                });
            }

            data = await response.json();

            if (data.success === 'true') {
                onLoadGeneratedModel(`http://localhost:8888/${data.path}`);
                handleClose();
            } else {
                setError(data.error || 'Đã xảy ra lỗi khi tạo mô hình.');
            }
        } catch (err) {
            setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`modal-backdrop${isClosing ? ' closing' : ''}`} onClick={handleClose} style={{ zIndex: 1000 }}>
            <div className={`modal-container${isClosing ? ' closing' : ''}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: step === 1 ? '700px' : '500px' }}>
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#modalIconGrad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <linearGradient id="modalIconGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                        <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                                    </linearGradient>
                                </defs>
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="modal-title">{step === 1 ? 'Thêm nội thất' : 'Tạo nội thất AI'}</h2>
                            <p className="modal-subtitle">
                                {step === 1 ? 'Chọn phương thức thêm nội thất' : 'Cấu hình thông số tạo mô hình 3D'}
                            </p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={handleClose} title="Đóng">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {step === 1 ? (
                        <div className="shape-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            <button className="shape-card" onClick={() => handleMethodSelect('choice')}>
                                <div className="shape-icon" style={{ color: 'var(--accent-purple)' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                </div>
                                <div className="shape-info">
                                    <span className="shape-name">Theo lựa chọn</span>
                                    <span className="shape-desc">Chọn loại và phong cách đồ nội thất</span>
                                </div>
                            </button>

                            <button className="shape-card" onClick={() => handleMethodSelect('describe')}>
                                <div className="shape-icon" style={{ color: 'var(--accent-cyan)' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <div className="shape-info">
                                    <span className="shape-name">Theo mô tả</span>
                                    <span className="shape-desc">Nhập văn bản mô tả đồ nội thất</span>
                                </div>
                            </button>

                            <button className="shape-card" onClick={() => handleMethodSelect('photo')}>
                                <div className="shape-icon" style={{ color: 'var(--accent-green)' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <div className="shape-info">
                                    <span className="shape-name">Theo ảnh</span>
                                    <span className="shape-desc">Tải lên hình ảnh sản phẩm</span>
                                </div>
                            </button>

                            <button className="shape-card" onClick={() => handleMethodSelect('local')}>
                                <div className="shape-icon" style={{ color: 'var(--text-secondary)' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                                <div className="shape-info">
                                    <span className="shape-name">Từ máy tính</span>
                                    <span className="shape-desc">Tải lên file mô hình 3D (.glb, .gltf)</span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="dimension-step" style={{ animation: 'shapeCardIn 0.35s ease both' }}>
                            <div className="design-form-container" style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}>
                                {selectedMethod === 'choice' && (
                                    <>
                                        <div className="form-group" style={{ marginBottom: '15px' }}>
                                            <label style={{ fontSize: '0.85rem' }}>Bạn muốn thiết kế gì?</label>
                                            <div className="options-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                                {OBJECTS.map(obj => (
                                                    <button key={obj} className={`option-btn ${object === obj ? 'active' : ''}`} onClick={() => setObject(obj)} style={{ padding: '8px', fontSize: '0.8rem' }}>{obj}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label style={{ fontSize: '0.85rem' }}>Phong cách thiết kế</label>
                                            <div className="options-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                                {STYLES.map(s => (
                                                    <button key={s} className={`option-btn ${style === s ? 'active' : ''}`} onClick={() => setStyle(s)} style={{ padding: '8px', fontSize: '0.8rem' }}>{s}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedMethod === 'describe' && (
                                    <div className="form-group" style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '0.85rem' }}>Mô tả ý tưởng của bạn (Tiếng Anh)</label>
                                        <textarea
                                            className="description-input"
                                            placeholder="Ví dụ: A high-detail 3D model of a mid-century wooden bookshelf..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={4}
                                            style={{ fontSize: '0.9rem', padding: '10px' }}
                                        />
                                    </div>
                                )}

                                {selectedMethod === 'photo' && (
                                    <div className="form-group" style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '0.85rem' }}>Chọn ảnh sản phẩm</label>
                                        <div
                                            className={`image-upload-zone ${preview ? 'has-preview' : ''}`}
                                            onClick={() => fileInputRef.current.click()}
                                            style={{ minHeight: '150px' }}
                                        >
                                            {preview ? (
                                                <img src={preview} alt="Preview" className="upload-preview" style={{ maxHeight: '150px' }} />
                                            ) : (
                                                <div className="upload-prompt">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <polyline points="21 15 16 10 5 21" />
                                                    </svg>
                                                    <span style={{ fontSize: '0.85rem' }}>Nhấn để chọn ảnh</span>
                                                </div>
                                            )}
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                                    </div>
                                )}

                                {error && <div className="error-message" style={{ margin: '10px 0', fontSize: '0.85rem' }}>{error}</div>}

                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        onClick={handleBack}
                                        disabled={loading}
                                        style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading || (selectedMethod === 'photo' && !file) || (selectedMethod === 'describe' && !description)}
                                        style={{ flex: 2, padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', color: '#fff', fontSize: '0.88rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                                    >
                                        {loading ? 'Đang tạo...' : 'Bắt đầu tạo 3D'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
