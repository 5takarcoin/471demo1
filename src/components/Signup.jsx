import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Job <span className="text-gray-500">Sphere</span></h1>
        <p className="text-gray-500 mb-8">Create an account to start your journey.</p>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" placeholder="name@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition" placeholder="••••••••" />
          </div>
          <button className="w-full bg-[#333333] text-white py-3 rounded-md font-semibold hover:bg-black transition shadow-md">
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