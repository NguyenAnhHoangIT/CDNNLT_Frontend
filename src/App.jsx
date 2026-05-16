import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DesignerPage from './components/DesignerPage';
import ChoicePage from './components/ChoicePage';
import DescribePage from './components/DescribePage';
import PhotoPage from './components/PhotoPage';
import Navbar from './components/Navbar';
import './App.css';

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/design" element={<DesignerPage />} />
                <Route path="/design-by-choice" element={<ChoicePage />} />
                <Route path="/design-as-described" element={<DescribePage />} />
                <Route path="/design-according-to-photo" element={<PhotoPage />} />
            </Routes>
        </Router>
    );
}
