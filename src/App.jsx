import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Jobs from './components/Jobs'; // Your main job board page

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Default route redirects to Login or Jobs depending on auth */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* The main dashboard you showed in the screenshot */}
          <Route path="/jobs" element={<Jobs />} />
          
          {/* Future scheduling page */}
          <Route path="/schedule" element={<div>Scheduling Page Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;