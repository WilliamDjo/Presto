import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import Login from './Pages/LoginPage/Login';
import LandingPage from './Pages/LandingPage/Landing';
import SignUp from './Pages/RegisterPage/Register';
import DashboardPage from './Pages/DashboardPage/Dashboard';
import Router from './Components/Router';

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
