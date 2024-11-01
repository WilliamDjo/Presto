import { useState } from 'react';
import SignUpPage from './Pages/SignUpPage/SignUp';
import SignInPage from './Pages/SignInPage/SignIn';
import LandingPage from './Pages/LandingPage/LandingPage';
import DashboardPage from './Pages/SignInPage/DashboardPage/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [page, setPage] = useState('SignUp');

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default App;
