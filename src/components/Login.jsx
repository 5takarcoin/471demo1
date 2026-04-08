import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to call your backend /api/auth/login goes here
    console.log("Logging in with:", formData);
    
    // Redirecting to jobs feed after "login"
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Job <span className="text-gray-500">Sphere</span>
        </h1>
        <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide text-xs mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" 
              placeholder="name@company.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide text-xs">
                Password
              </label>
              <a href="#" className="text-xs text-gray-400 hover:text-black">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" 
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="h-4 w-4 accent-black border-gray-300 rounded" />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
              Remember for 30 days
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#333333] text-white py-3 rounded-md font-semibold hover:bg-black transition shadow-md active:scale-[0.98]"
          >
            Log In
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black font-bold hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;