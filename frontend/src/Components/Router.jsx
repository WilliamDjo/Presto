import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from '../Pages/LoginPage/Login';
import LandingPage from '../Pages/LandingPage/Landing';
import Register from '../Pages/RegisterPage/Register';
import DashboardPage from '../Pages/DashboardPage/Dashboard';
import PresentationPage from '../Pages/PresentationPage/Presentation';
import PresentationPreview from '../Pages/PresentationPage/Preview/PresentationPreview';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPresentations, fetchPresentations } from '../State/presentationsSlice';
import { getRoute } from '../HelperFiles/helper';

const Router = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem('token') && !['login', 'register', ''].includes(getRoute())) {
      navigate('/');
    }
    
    if (localStorage.getItem('token') && !['dashboard', 'presentation', 'preview'].includes(getRoute())) {
      navigate('/dashboard');
    }

    if (localStorage.getItem('token')) {
      dispatch(fetchPresentations());
    } else {
      dispatch(setPresentations(null));
    }
  }, [dispatch, navigate])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/presentation/*" element={<PresentationPage />} />
      <Route path="/preview/:id" element={<PresentationPreview />} />
    </Routes>
  );
};

export default Router;
