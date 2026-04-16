import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = true;  

  const activeStyle = "border-b-2 border-white pb-1 transition-all";
  const inactiveStyle = "hover:text-gray-400 transition-colors";

  const user = JSON.parse(localStorage.getItem('user'));
const userName = encodeURIComponent(user?.name || "Guest");
const avatarUrl = `https://ui-avatars.com/api/?name=${userName}&background=6366f1&color=fff`;

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-[#2D2D2D] text-white">
      <div className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => navigate('/jobs')}>
        JOB<span className="font-light text-gray-300">SPHERE</span>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex gap-8 text-sm font-medium uppercase tracking-wider">
          {/* <NavLink to="/home" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Home</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Profile</NavLink> */}
          <NavLink to="/schedule" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Schedule</NavLink>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Jobs</NavLink>
        </div>

        {isLoggedIn && (
          <div className="flex items-center gap-4 pl-8 border-l border-gray-600">
            <button 
              onClick={() => navigate('/login')} 
              className="text-xs font-bold uppercase hover:text-red-400 transition-colors"
            >
              Logout
            </button>
            <img 
  src={`https://ui-avatars.com/api/?name=${userName}&background=random&color=fff`} 
  className="w-9 h-9 rounded-full border-2 border-white/20 shadow-lg" 
  alt="User Avatar" 
/>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;