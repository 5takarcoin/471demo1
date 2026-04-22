import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SchedulePage from './pages/SchedulePage';
import Jobs from './pages/Jobs'; // Import your jobs component
import Login from './pages/Login';
import Signup from './pages/Signup';
import CoverLetterPage from './pages/CoverLetter';
import ProfilePage from "./pages/ProfilePage";
import JobDetailsPage from "./pages/JobDetailsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import EmployerDashboard from "./pages/EmployerDashboard";



const Layout = ({ children }) => {
  const location = useLocation();
  const authRoutes = ['/login', '/signup'];
  const showNavbar = !authRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <div className="flex-grow bg-white">
        {children}
      </div>
      {showNavbar && (
        <footer className="bg-[#2D2D2D] text-white text-center py-4 text-xs mt-auto">
          Copyright © 2026 JobSphere. All rights reserved.
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default landing page is now Jobs */}
          <Route path="/" element={<Navigate to="/jobs" />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main Tabs */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/schedule" element={<SchedulePage />} />
          
<Route path="/profile" element={<ProfilePage />} />

<Route path="/jobs/:jobId" element={<JobDetailsPage />} />

<Route path="/recommendations" element={<RecommendationsPage />} />


<Route path="/employer" element={<EmployerDashboard />} />
          
          {/* Placeholder-free links for the rest */}
          {/* <Route path="/home" element={<div className="p-10">Home Content</div>} />
          <Route path="/profile" element={<div className="p-10">Profile Content</div>} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;