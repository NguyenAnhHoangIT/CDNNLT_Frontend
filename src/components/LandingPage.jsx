import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';

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

            {/* Hero Section — two-column layout */}
            <section className="hero-section">
                <div className="hero-content">
                    {/* Left column */}
                    <div className="hero-left">
                        <div className="hero-badge">
                            <span className="hero-badge-dot"></span>
                            Trusted by 50,000+ interior designers
                        </div>

                        <h1 className="hero-title">
                            Design Your<br />
                            Space in <span className="hero-title-accent">3D</span>
                        </h1>

                        <p className="hero-subtitle">
                            Place, rotate, and customize real 3D furniture in your room
                            before you buy. No guessing. Just perfect spaces.
                        </p>

                        <div className="hero-actions">
                            <button
                                className="hero-btn-primary"
                                onClick={() => navigate('/design')}
                            >
                                Start Designing Free
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                            <button
                                className="hero-btn-secondary"
                                onClick={() => {
                                    const el = document.getElementById('how-it-works');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                                </svg>
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* Right column — 3D editor mockup */}
                    <div className="hero-right">
                        <div className="hero-mockup">
                            <div className="mockup-toolbar">
                                <div className="mockup-toolbar-dots">
                                    <span className="dot dot-red"></span>
                                    <span className="dot dot-yellow"></span>
                                    <span className="dot dot-green"></span>
                                </div>
                                <div className="mockup-toolbar-btn">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.5 2v6h-6" />
                                        <path d="M21.34 15.57a10 10 0 1 1-.57-8.38" />
                                    </svg>
                                </div>
                                <div className="mockup-coords">X: 12 Y: 45 Z: 0</div>
                            </div>
                            <div className="mockup-viewport">
                                {/* Grid floor */}
                                <div className="mockup-grid">
                                    {Array.from({ length: 36 }).map((_, i) => (
                                        <div key={i} className="mockup-grid-cell"></div>
                                    ))}
                                </div>
                                <div className="mockup-furniture" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                                    <img
                                        src={heroImage}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                    />
                                </div>
                                {/* Floating gizmo */}
                                <div className="mockup-gizmo">
                                    <div className="gizmo-line gizmo-x"></div>
                                    <div className="gizmo-line gizmo-y"></div>
                                    <div className="gizmo-line gizmo-z"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <h2 className="section-title">Everything You Need to Design Perfectly</h2>
                <p className="section-subtitle">Professional-grade tools made simple for everyone.</p>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-cyan">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.5 2v6h-6" />
                                <path d="M21.34 15.57a10 10 0 1 1-.57-8.38" />
                            </svg>
                        </div>
                        <h3>Real-Time 3D Rotation</h3>
                        <p>Spin, tilt and inspect every furniture piece from any angle with fluid 60fps interaction.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                        </div>
                        <h3>Room Dimension Mapping</h3>
                        <p>Input your room's exact measurements and see furniture fit perfectly to scale.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="13.5" cy="6.5" r="2.5" />
                                <path d="M17 22H2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5z" />
                                <path d="M22 10l-4 4-2-2" />
                            </svg>
                        </div>
                        <h3>Material & Color Studio</h3>
                        <p>Swap wood finishes, fabrics, and colors in real time to match your vision.</p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="steps-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h4>Choose Room Shape</h4>
                        <p>Select a room layout that matches your space</p>
                    </div>
                    <div className="step-connector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h4>Place Furniture</h4>
                        <p>Add and arrange furniture inside your room</p>
                    </div>
                    <div className="step-connector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h4>Finalize Design</h4>
                        <p>View results in 3D and customize to your liking</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-left">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                            <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
                            </linearGradient>
                        </defs>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Room Designer AI</span>
                </div>
                <p className="footer-copy">© 2026 Room Designer AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
