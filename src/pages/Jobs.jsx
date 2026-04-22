import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'saved'

  const navigate = useNavigate();

  // Filter States
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('All');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Fetch Logic - Handles both Search and Bookmarks
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      
      // Determine which endpoint to hit based on the active tab
      const endpoint = activeTab === 'all' 
        ? 'http://localhost:1008/api/search/search' 
        : `http://localhost:1008/api/search/bookmarks/${user?.id}`;

      try {
        const response = await axios.get(endpoint, {
          params: {
            keyword: search || undefined,
            jobType: jobType === 'All' ? undefined : jobType,
            location: location || undefined,
            minSalary: Number(salary) > 0 ? salary : undefined,
            userId: user?.id // Vital for the backend to flag isBookmarked: true/false
          }
        });

        let data = response.data.data || [];
        
        // When in 'saved' tab, we force the icon to be 'on'
        if (activeTab === 'saved') {
          data = data.map(job => ({ ...job, isBookmarked: true }));
        }
        
        setJobs(data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => getData(), 400);
    return () => clearTimeout(timer);
  }, [activeTab, search, jobType, location, salary, user?.id]);

  // 2. Toggle Bookmark Logic (Optimistic UI)
  const toggleBookmark = async (jobId) => {
    if (!user) return alert("Please login to bookmark jobs");

    // Instant UI Update
    const originalJobs = [...jobs];
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job._id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );

    try {
      const response = await axios.post('http://localhost:1008/api/search/bookmarks/toggle', {
        jobId,
        userId: user.id
      });

      // If we are in the 'saved' tab and unbookmarked, remove it from list
      if (activeTab === 'saved' && response.data.bookmarked === false) {
        setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      }
    } catch (error) {
      console.error("Bookmark error", error);
      setJobs(originalJobs); // Revert UI if server fails
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar Filters */}
      <aside className="w-64 bg-[#D9D9D9] p-6 space-y-8 shadow-inner">
        <h2 className="text-xl font-bold border-b border-gray-400 pb-2 text-gray-800">Filters</h2>
        
        {/* Job Type Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Job Type</h3>
          {['All', 'Full-Time', 'Part-Time', 'Contract', 'Internship'].map(type => (
            <label key={type} className="flex items-center space-x-3 mb-2 cursor-pointer group">
              <input 
                type="radio" 
                name="type" 
                className="w-4 h-4 accent-black" 
                checked={jobType === type}
                onChange={() => setJobType(type)}
              />
              <span className="text-sm group-hover:text-black transition">{type}</span>
            </label>
          ))}
        </div>

        {/* Location Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Location</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. Dhaka"
              className="w-full p-2 text-sm rounded border border-gray-400 bg-[#F5F5F5] outline-none focus:ring-1 focus:ring-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Salary Range Filter */}
        <div>
          <h3 className="font-semibold mb-1 text-gray-700">Min Salary</h3>
          <p className="text-xs font-bold text-gray-500 mb-3">{salary.toLocaleString()} BDT</p>
          <input 
            type="range" 
            min="0" 
            max="150000" 
            step="5000"
            className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-black"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <div className="flex justify-between text-[10px] mt-2 font-bold text-gray-500">
            <span>0</span>
            <span>150k+</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Tabs System */}
          <div className="flex space-x-8 mb-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'border-b-4 border-black text-black' : 'text-gray-400 hover:text-black'}`}
            >
              All Opportunities
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'saved' ? 'border-b-4 border-black text-black' : 'text-gray-400 hover:text-black'}`}
            >
              Saved Jobs {activeTab === 'saved' && `(${jobs.length})`}
            </button>
          </div>

          {/* Search Bar - Hidden when in Saved Jobs to keep UI clean */}
          {activeTab === 'all' && (
            <div className="relative mb-10 group">
              <input 
                type="text" 
                placeholder="Search by Job Title or Skills (e.g. React, Node)..." 
                className="w-full p-5 pl-14 rounded-xl bg-white shadow-sm border border-transparent outline-none focus:border-gray-400 transition-all text-gray-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-5 top-5 text-xl grayscale opacity-50 group-focus-within:opacity-100 transition">🔍</span>
            </div>
          )}

          {/* Job Feed */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4"></div>
                <p className="text-gray-500 font-medium">Updating results...</p>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id}  onClick={() => navigate(`/jobs/${job._id}`)} className="cursor-pointer relative group bg-white p-7 rounded-xl shadow-sm border border-gray-100 hover:border-black transition-all hover:shadow-md">
                  
                  {/* Bookmark Button */}
                  <button 
                    onClick={() => toggleBookmark(job._id)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all active:scale-125"
                    title={job.isBookmarked ? "Remove Bookmark" : "Save Job"}
                  >
                    <span className={`text-2xl ${job.isBookmarked ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}>
                      {job.isBookmarked ? '🔖' : '📑'}
                    </span>
                  </button>

                  <div className="flex justify-between items-start pr-12">
                    <div className='flex flex-col items-start'>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition">{job.jobTitle}</h3>
                      <p className="text-gray-500 font-medium mt-1">📍 {job.location} • 🏢 {job.employerId}</p>
                    </div>
                    <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                      {job.jobType}
                    </span>
                  </div>
                  
                  {/* Skills Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.requiredSkills?.map(skill => (
                      <span key={skill} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-bold uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-2 italic">
                    "{job.description}"
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1">Est. Salary</span>
                      <span className="text-lg font-black text-gray-900">
                        {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()} <span className="text-xs font-normal">BDT</span>
                      </span>
                    </div>
                    <button className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:scale-105 active:scale-95 transition shadow-lg text-sm">
                      Apply Position
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-lg font-medium">
                  {activeTab === 'all' ? "No matches found." : "You haven't saved any jobs yet."}
                </p>
                {activeTab === 'all' && (
                  <button 
                    onClick={() => {setSearch(''); setJobType('All'); setLocation(''); setSalary(0);}}
                    className="mt-2 text-black font-bold hover:underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;