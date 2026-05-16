import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();

    // Hide Navbar in 3D editor to prevent double headers
    if (location.pathname === '/design') {
        return null;
    }

    return (
        <nav className="main-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#navLogoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                            <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                            </linearGradient>
                        </defs>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Room Designer AI</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>Trang chủ</Link>
                    <Link to="/design-by-choice" className={`nav-item ${location.pathname === '/design-by-choice' ? 'active' : ''}`}>Theo lựa chọn</Link>
                    <Link to="/design-as-described" className={`nav-item ${location.pathname === '/design-as-described' ? 'active' : ''}`}>Theo mô tả</Link>
                    <Link to="/design-according-to-photo" className={`nav-item ${location.pathname === '/design-according-to-photo' ? 'active' : ''}`}>Theo ảnh</Link>
                    <Link to="/room-from-photo" className={`nav-item ${location.pathname === '/room-from-photo' ? 'active' : ''}`}>Phòng từ ảnh</Link>
                    <Link to="/option-config" className={`nav-item ${location.pathname === '/option-config' ? 'active' : ''}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Tùy chọn
                    </Link>
                    <Link to="/design" className={`nav-item nav-btn ${location.pathname === '/design' ? 'active' : ''}`}>
                        <span>3D Editor</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
