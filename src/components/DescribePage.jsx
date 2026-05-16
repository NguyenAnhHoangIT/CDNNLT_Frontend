import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignPages.css';

export default function DescribePage() {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Vui lòng nhập mô tả.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8888/model/generate_custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });

            const data = await response.json();
            if (data.success === 'true') {
                navigate('/design', { state: { generatedModelUrl: `http://localhost:8888/${data.path}` } });
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
        <div className="design-page">
            <div className="page-header">
                <h1>Design as described</h1>
                <p>Mô tả chi tiết món đồ nội thất bạn mong muốn, AI sẽ hiện thực hóa nó.</p>
            </div>

            <div className="design-form-container">
                <div className="form-group">
                    <label>Mô tả ý tưởng của bạn (Tiếng Anh sẽ cho kết quả tốt hơn)</label>
                    <textarea
                        className="description-input"
                        placeholder="Ví dụ: A high-detail 3D model of a mid-century wooden bookshelf with brass accents..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                    />
                    <div className="input-tips">
                        <span>Gợi ý: Hãy mô tả về chất liệu, màu sắc và kiểu dáng.</span>
                    </div>
                </div>

                <button
                    className={`generate-btn ${loading ? 'loading' : ''}`}
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? 'Đang thiết kế...' : 'Bắt đầu tạo 3D'}
                </button>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
