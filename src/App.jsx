import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats'; // Import komponen Chats kamu

const PrivateRoute = ({ children }) => {
    return localStorage.getItem('access_token') ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/chats" element={<PrivateRoute><Chats /></PrivateRoute>} /> {/* Ini route untuk halaman Chats */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}