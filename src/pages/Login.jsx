import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Send data to your backend controller
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);

      // 2. If successful, your controller returns { token, user }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (response.data.user.role === "employer") {
          navigate("/employer");
        } else {
          navigate("/jobs"); // or wherever applicants go
        }
      }
    } catch (err) {
      // 4. Handle errors (User not found, Invalid credentials, etc.)
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center font-sans p-4">
      <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
         <span className="text-black"> Job</span> <span className="text-gray-500">Sphere</span>
        </h1>
        <p className="text-gray-500 mb-8 font-medium">Welcome back! Please enter your details.</p>
        
        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider text-[10px] mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" 
              placeholder="name@company.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider text-[10px]">
                Password
              </label>
              <a href="#" className="text-[11px] text-gray-400 hover:text-black transition">Forgot password?</a>
            </div>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" 
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="h-4 w-4 accent-black border-gray-300 rounded cursor-pointer" />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer">
              Remember for 30 days
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#333333] text-white py-3 rounded-md font-semibold transition shadow-md active:scale-[0.98] ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
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