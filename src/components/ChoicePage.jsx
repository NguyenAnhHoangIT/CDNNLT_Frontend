import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignPages.css';

const OBJECTS = ['Sofa', 'Chair', 'Table', 'Bed', 'Bookshelf', 'Cabinet', 'Lamp', 'Plant Pot'];
const STYLES = ['Modern', 'Classic', 'Minimalist', 'Industrial', 'Scandinavian', 'Vintage'];

export default function ChoicePage() {
    const navigate = useNavigate();
    const [object, setObject] = useState(OBJECTS[0]);
    const [style, setStyle] = useState(STYLES[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8888/model/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ object, style: style.toLowerCase() })
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
                <h1>Design by choice</h1>
                <p>Chọn các thông số cơ bản để AI tự động thiết kế mô hình 3D cho bạn.</p>
            </div>

            <div className="design-form-container">
                <div className="form-group">
                    <label>Bạn muốn thiết kế gì?</label>
                    <div className="options-grid">
                        {OBJECTS.map(obj => (
                            <button
                                key={obj}
                                className={`option-btn ${object === obj ? 'active' : ''}`}
                                onClick={() => setObject(obj)}
                            >
                                {obj}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Phong cách thiết kế</label>
                    <div className="options-grid">
                        {STYLES.map(s => (
                            <button
                                key={s}
                                className={`option-btn ${style === s ? 'active' : ''}`}
                                onClick={() => setStyle(s)}
                            >
                                {s}
                            </button>
                        ))}
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
