import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update state as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:1008/api/auth/signup', formData);
      
      if (response.status === 201) {
        alert("Account created! Redirecting to login...");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Job <span className="text-gray-500">Sphere</span></h1>
        <p className="text-gray-500 mb-8">Create an account to start your journey.</p>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              name="name" // MUST match the key in formData
              required
              className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" 
              placeholder="John Doe" 
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" 
              placeholder="name@company.com" 
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" 
              placeholder="••••••••" 
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="w-full bg-[#333333] text-white py-3 rounded-md font-semibold hover:bg-black transition shadow-md">
            Sign Up
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;