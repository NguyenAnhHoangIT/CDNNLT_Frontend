import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignPages.css';

export default function PhotoPage() {
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
            setError('Vui lòng chọn một tấm ảnh.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8888/model/generate_from_image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success === 'true') {
                navigate('/design', { state: { generatedModelUrl: `http://localhost:8888/${data.path}` } });
            } else {
                setError(data.error || 'Đã xảy ra lỗi khi xử lý ảnh.');
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
                <h1>Design according to photo</h1>
                <p>Tải lên ảnh một món đồ nội thất, AI sẽ tạo ra mô hình 3D tương ứng.</p>
            </div>

            <div className="design-form-container">
                <div className="form-group">
                    <label>Chọn ảnh sản phẩm</label>
                    <div
                        className={`image-upload-zone ${preview ? 'has-preview' : ''}`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="upload-preview" />
                        ) : (
                            <div className="upload-prompt">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span>Nhấn để chọn ảnh hoặc kéo thả vào đây</span>
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
                    {loading ? 'Đang phân tích và tạo 3D...' : 'Bắt đầu tạo 3D'}
                </button>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
