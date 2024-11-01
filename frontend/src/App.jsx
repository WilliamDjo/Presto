import { useState } from 'react';
import SignUp from './Pages/SignUp/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [page, setPage] = useState('SignUp');

  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
