import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CameraPage from './pages/CameraPage';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="camera" element={<CameraPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
