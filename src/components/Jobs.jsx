import { useState, useEffect } from 'react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar Filters */}
      <aside className="w-64 bg-[#D9D9D9] p-6 space-y-8">
        <h2 className="text-xl font-bold border-b border-gray-400 pb-2">Filters</h2>
        
        <div>
          <h3 className="font-semibold mb-3">Job Type</h3>
          {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map(type => (
            <label key={type} className="flex items-center space-x-2 mb-2 cursor-pointer">
              <input type="radio" name="type" className="accent-black" />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Salary Range (BDT)</h3>
          <input type="range" min="15000" max="150000" className="w-full accent-black" />
          <div className="flex justify-between text-xs mt-2">
            <span>15k</span>
            <span>150k+</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-8">
            <input type="text" placeholder="Search for jobs..." className="w-full p-4 pl-12 rounded-lg bg-gray-200 border-none outline-none focus:ring-2 focus:ring-gray-400" />
            <span className="absolute left-4 top-4 text-gray-500">🔍</span>
          </div>

          <div className="space-y-4">
            {/* Job Card - Mapping your model */}
            <div className="bg-[#D9D9D9] p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Senior Software Engineer</h3>
                  <p className="text-gray-600 font-medium">Tech Innovators • Dhaka, Bangladesh</p>
                </div>
                <span className="bg-white px-3 py-1 rounded text-xs font-bold uppercase">Full-Time</span>
              </div>
              <p className="mt-4 text-gray-700 line-clamp-2">
                Join our dynamic team to work on cutting-edge technology solutions using the MERN stack...
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">Applied: 12 candidates</span>
                <button className="bg-black text-white px-6 py-2 rounded-md hover:opacity-80 transition">Apply Now</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;