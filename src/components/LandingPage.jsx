import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Animated background particles */}
            <div className="landing-bg">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>
                <div className="grid-overlay"></div>
            </div>

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="landing-logo">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#landingLogoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                            <linearGradient id="landingLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                            </linearGradient>
                        </defs>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Room Designer</span>
                </div>
                <div className="landing-nav-links">
                    <a href="#features" className="nav-link">Tính năng</a>
                    <a href="#how-it-works" className="nav-link">Hướng dẫn</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Công cụ thiết kế 3D miễn phí
                </div>

                <h1 className="hero-title">
                    Thiết kế ngôi nhà
                    <span className="hero-title-gradient"> mơ ước </span>
                    của bạn
                </h1>

                <p className="hero-subtitle">
                    Trải nghiệm thiết kế nội thất 3D trực quan. Chọn kiểu nhà, bố trí nội thất
                    và xem ngôi nhà của bạn trở nên sống động chỉ trong vài phút.
                </p>

                <div className="hero-actions">
                    <button
                        id="start-design-btn"
                        className="hero-btn-primary"
                        onClick={() => navigate('/design')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        Bắt đầu thiết kế
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>

                {/* Hero 3D preview illustration */}
                <div className="hero-visual">
                    <div className="hero-card hero-card-1">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#card1Grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <defs>
                                <linearGradient id="card1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                    <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                                </linearGradient>
                            </defs>
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span>Mô hình 3D</span>
                    </div>
                    <div className="hero-card hero-card-2">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#card2Grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <defs>
                                <linearGradient id="card2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#34d399' }} />
                                    <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                                </linearGradient>
                            </defs>
                            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                            <polyline points="17 2 12 7 7 2" />
                        </svg>
                        <span>Nội thất</span>
                    </div>
                    <div className="hero-card hero-card-3">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#card3Grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <defs>
                                <linearGradient id="card3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#f472b6' }} />
                                    <stop offset="100%" style={{ stopColor: '#a78bfa' }} />
                                </linearGradient>
                            </defs>
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                        <span>Tùy chỉnh</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </div>
                        <h3>Chọn kiểu nhà</h3>
                        <p>Nhiều mẫu nhà sẵn có: hình vuông, chữ L, chữ U, chữ T... để bạn lựa chọn</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-cyan">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                        </div>
                        <h3>Xem 3D trực quan</h3>
                        <p>Xoay, zoom, di chuyển camera để xem ngôi nhà từ mọi góc độ trong không gian 3D</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <h3>Thêm nội thất</h3>
                        <p>Kéo thả file 3D nội thất vào ngôi nhà, di chuyển, xoay và thay đổi kích thước tự do</p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="steps-section">
                <h2 className="section-title">Cách sử dụng</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h4>Chọn kiểu nhà</h4>
                        <p>Lựa chọn mẫu nhà phù hợp với nhu cầu của bạn</p>
                    </div>
                    <div className="step-connector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h4>Bố trí nội thất</h4>
                        <p>Thêm và sắp xếp đồ nội thất bên trong ngôi nhà</p>
                    </div>
                    <div className="step-connector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h4>Hoàn thiện</h4>
                        <p>Xem kết quả 3D và tùy chỉnh theo ý thích</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
