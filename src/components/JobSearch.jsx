import { useState } from 'react';

const JobSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({ keyword: '', location: '', jobType: '' });

  const handleSearch = () => {
    onSearch(filters); // Function passed from parent to fetch data
  };

  return (
    <div className="bg-[#D9D9D9] p-4 rounded-lg flex flex-wrap gap-4 items-end shadow-sm border border-gray-300">
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-bold uppercase text-gray-600">Keyword</label>
        <input 
          type="text" 
          placeholder="e.g. Developer"
          className="w-full p-2 mt-1 bg-white border border-gray-300 rounded outline-none focus:border-black"
          onChange={(e) => setFilters({...filters, keyword: e.target.value})}
        />
      </div>
      
      <div className="w-40">
        <label className="text-xs font-bold uppercase text-gray-600">Type</label>
        <select 
          className="w-full p-2 mt-1 bg-white border border-gray-300 rounded outline-none"
          onChange={(e) => setFilters({...filters, jobType: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <button 
        onClick={handleSearch}
        className="bg-black text-white px-8 py-2 rounded font-bold hover:bg-gray-800 transition"
      >
        Search
      </button>
    </div>
  );
};