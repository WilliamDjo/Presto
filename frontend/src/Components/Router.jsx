import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from '../Pages/LoginPage/Login';
import LandingPage from '../Pages/LandingPage/Landing';
import SignUp from '../Pages/RegisterPage/Register';
import DashboardPage from '../Pages/DashboardPage/Dashboard';
import PresentationPage from '../Pages/PresentationPage/Presentation';
import { useEffect } from 'react';
import TestPage from '../Pages/TestPage';


const Router = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token') && !['login', 'register', '', 'test'].includes(location.pathname.split("/")[1])) {
      navigate('/');
    }

    if (localStorage.getItem('token') && !['dashboard', 'presentation'].includes(location.pathname.split("/")[1])) {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/presentation/*" element={<PresentationPage />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
};

export default Router;
