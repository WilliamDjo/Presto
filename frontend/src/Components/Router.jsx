import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from '../Pages/LoginPage/Login';
import LandingPage from '../Pages/LandingPage/Landing';
import SignUp from '../Pages/RegisterPage/Register';
import DashboardPage from '../Pages/DashboardPage/Dashboard';
import { useEffect } from 'react';


const Router = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token') && !['/login', '/register', '/'].includes(location.pathname)) {
            navigate('/');
        }

        if (localStorage.getItem('token') && !['/dashboard'].includes(location.pathname)) {
            navigate('/dashboard');
        }
    }, [location.pathname])

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    );
};

export default Router;
