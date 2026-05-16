import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignPages.css';

const API_BASE = 'http://localhost:8888';

export default function ChoicePage() {
    const navigate = useNavigate();
    const [objects, setObjects] = useState([]);
    const [styles, setStyles] = useState([]);
    const [object, setObject] = useState('');
    const [style, setStyle] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingOptions, setFetchingOptions] = useState(true);
    const [error, setError] = useState(null);

    // Fetch objects and styles from OptionService on mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [objRes, styleRes] = await Promise.all([
                    fetch(`${API_BASE}/option/objects`),
                    fetch(`${API_BASE}/option/styles`)
                ]);
                const objData = await objRes.json();
                const styleData = await styleRes.json();
                setObjects(objData);
                setStyles(styleData);
                if (objData.length > 0) setObject(objData[0].name);
                if (styleData.length > 0) setStyle(styleData[0].name);
            } catch (err) {
                setError('Không thể tải danh sách tùy chọn. Vui lòng kiểm tra backend.');
            } finally {
                setFetchingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/model/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ object, style: style.toLowerCase() })
            });

            const data = await response.json();
            if (data.success === 'true') {
                navigate('/design', { state: { generatedModelUrl: `${API_BASE}/${data.path}` } });
            } else {
                setError(data.error || 'Đã xảy ra lỗi khi tạo mô hình.');
            }
        } catch (err) {
            setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingOptions) {
        return (
            <div className="design-page">
                <div className="page-header">
                    <h1>Design by choice</h1>
                    <p>Đang tải danh sách tùy chọn...</p>
                </div>
            </div>
        );
    }

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
                        {objects.map(obj => (
                            <button
                                key={obj.id}
                                className={`option-btn ${object === obj.name ? 'active' : ''}`}
                                onClick={() => setObject(obj.name)}
                            >
                                {obj.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Phong cách thiết kế</label>
                    <div className="options-grid">
                        {styles.map(s => (
                            <button
                                key={s.id}
                                className={`option-btn ${style === s.name ? 'active' : ''}`}
                                onClick={() => setStyle(s.name)}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className={`generate-btn ${loading ? 'loading' : ''}`}
                    onClick={handleGenerate}
                    disabled={loading || !object || !style}
                >
                    {loading ? 'Đang thiết kế...' : 'Bắt đầu tạo 3D'}
                </button>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
