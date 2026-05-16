import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignPages.css';

const API_BASE = 'http://localhost:8888';

export default function RoomPhotoPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleGenerate = async () => {
        if (!file) {
            setError('Vui lòng chọn một tấm ảnh phòng.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE}/model/generate_room_from_image`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success === 'true') {
                navigate('/design', { state: { generatedModelUrl: `${API_BASE}/${data.path}`, isRoom: true } });
            } else {
                setError(data.error || 'Đã xảy ra lỗi khi xử lý ảnh phòng.');
            }
        } catch (err) {
            setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="design-page">
            <div className="page-header">
                <h1>Room from Photo</h1>
                <p>Tải lên ảnh căn phòng của bạn, AI sẽ tạo ra mô hình 3D tương ứng.</p>
            </div>

            <div className="design-form-container">
                <div className="form-group">
                    <label>Chọn ảnh phòng</label>
                    <div
                        className={`image-upload-zone ${preview ? 'has-preview' : ''}`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="upload-preview" />
                        ) : (
                            <div className="upload-prompt">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <span>Nhấn để chọn ảnh căn phòng hoặc kéo thả vào đây</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hỗ trợ JPG, PNG — Ảnh phải là hình chụp căn phòng thật</span>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                    />
                </div>

                <button
                    className={`generate-btn ${loading ? 'loading' : ''}`}
                    onClick={handleGenerate}
                    disabled={loading || !file}
                >
                    {loading ? 'Đang phân tích phòng và tạo 3D...' : 'Bắt đầu tạo phòng 3D'}
                </button>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
