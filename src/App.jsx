import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DesignerPage from './components/DesignerPage';
import './App.css';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/design" element={<DesignerPage />} />
            </Routes>
        </Router>
    );
}
