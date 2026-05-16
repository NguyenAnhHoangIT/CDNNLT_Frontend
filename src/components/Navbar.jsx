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
                    <Link to="/design" className={`nav-item nav-btn ${location.pathname === '/design' ? 'active' : ''}`}>
                        <span>3D Editor</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
