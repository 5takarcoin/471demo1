import React, {useState, useEffect} from 'react';
import axios from 'axios';

const SchedulePage = () => {

    const [viewDate, setViewDate] = useState(new Date()); // Defaults to today

// Helper to get days in the current viewDate month
const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
const monthName = viewDate.toLocaleString('default', { month: 'long' });
const year = viewDate.getFullYear();

    const [interviews, setInterviews] = useState([]);
const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track which item is being edited
const [formData, setFormData] = useState({
  company: '',
  role: '',
  date: '',
  color: '#B4B9E8',
  notes: '' // New notes field
});


const handleCalendarClick = (day) => {
  const month = (viewDate.getMonth() + 1).toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  const yearStr = viewDate.getFullYear();
  
  const dateString = `${formattedDay}/${month}/${yearStr}`; // For DB Comparison
  const inputDate = `${yearStr}-${month}-${formattedDay}`;   // For HTML Input
  
  const existing = interviews.find(i => i.date === dateString);

  if (existing) {
    setEditingId(existing._id);
    setFormData({ ...existing, date: inputDate });
  } else {
    setEditingId(null);
    setFormData({ company: '', role: '', date: inputDate, color: '#B4B9E8', notes: '' });
  }
  setIsModalOpen(true);
};

  const colorOptions = [
  // Original Brand Colors
  { name: 'Lavender', hex: '#B4B9E8' },
  { name: 'Emerald', hex: '#00A86B' },
  { name: 'Rose', hex: '#FF9B94' },
  
  // New Professional Additions
  { name: 'Sky Blue', hex: '#A0CED9' },   // Calm, informational
  { name: 'Amber', hex: '#FFC857' },      // High priority/Warning
  { name: 'Sage', hex: '#A3B18A' },       // Neutral/Nature
  { name: 'Slate', hex: '#94A3B8' },      // Corporate/Technical
  { name: 'Terracotta', hex: '#E29578' }, // Warm/Unique
  { name: 'Mint', hex: '#99DDC8' },       // Fresh/Follow-up
  { name: 'Soft Gold', hex: '#E9C46A' }   // Premium/Reward
];

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleOpenAdd = () => {
  setEditingId(null);
  setFormData({ company: '', role: '', date: '', color: '#B4B9E8', notes: '' });
  setIsModalOpen(true);
};

const handleOpenEdit = (interview) => {
  setEditingId(interview.id);
  // Convert DD/MM/YYYY back to YYYY-MM-DD for the date input
  const dateParts = interview.date.split('/');
  const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  
  setFormData({
    company: interview.company,
    role: interview.role,
    date: formattedDate,
    color: interview.color.match(/#[A-Za-z0-9]+/)?.[0] || '#B4B9E8',
    notes: interview.notes || ''
  });
  setIsModalOpen(true);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const user = JSON.parse(localStorage.getItem('user')); // Convert string to object

    const payload = {
    ...formData,
    userId: user?.id || user?._id, // Handles both .id and ._id formats
    date: formData.date.split('-').reverse().join('/')
    };

  try {
    let response;
    if (editingId) {
      response = await axios.put(`http://localhost:1008/api/interview/${editingId}`, payload);
      setInterviews(interviews.map(i => i._id === editingId ? response.data : i));
    } else {
      response = await axios.post('http://localhost:1008/api/interview', payload);
      setInterviews([response.data, ...interviews]);
    }
    
    setFormData({ company: '', role: '', date: '', color: '#B4B9E8', notes: '' });
    setIsModalOpen(false);
    setEditingId(null);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  
useEffect(() => {
  const fetchInterviews = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || user?._id;

      if (!userId) return;

      const response = await axios.get(`http://localhost:1008/api/interview?userId=${userId}`);
      

      setInterviews(response.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  fetchInterviews();
}, []);

  return (
    <div className="flex bg-white min-h-screen font-sans antialiased text-slate-900">
      {/* Left Content: The Interview Feed */}
      <section className="flex-[3] px-16 py-12">
        <header className="mb-10">
          <h2 className="text-3xl font-light tracking-tight text-slate-900 uppercase">
             <span className="text-slate-400 font-light italic">Upcoming Interviews</span>
          </h2>
          <div className="h-1 w-20 bg-slate-900 mt-2"></div>
        </header>

        <div className="space-y-8 max-w-4xl">
          {interviews.map((item, i) => (
            <div
              key={item.color+item.company+i} 
              className={`${item.color} rounded-sm p-8 flex flex-col justify-between min-h-[180px] shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group`}
            >
              {/* Subtle background pattern/accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-white/20 transition-all"></div>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase mb-1">{item.company}</h3>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold opacity-90">{item.role}</p>
                    <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      📍 Dhaka, Bangladesh
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black italic tracking-tighter italic border-b-2 border-black/20 leading-none">
                    {item.date}
                  </p>
                </div>
              </div>

              
            <div className="mt-8 border-t border-black/10 pt-4 relative z-10 text-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Notes</span>
        {/* EDIT BUTTON TRIGGER */}
        <button 
          onClick={() => handleOpenEdit(item)}
          className="text-[10px] font-bold uppercase hover:underline"
        >
          ✎ edit
        </button>
      </div>
      <p className="font-medium opacity-80">{item.notes || "No notes added."}</p>
    </div>
  </div>
          ))}
        </div>
      </section>

      {/* Right Sidebar: The Command Center */}
      <aside className="bg-[#E8E8E8] border-l border-slate-300 p-10 flex flex-col">
        <div className="mb-12">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Calendar</h3>
          
          {/* Professional Calendar Grid */}
          <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 border border-white">
  <div className="flex justify-between items-center mb-4 bg-gray-200 px-2 py-1 border-l-4 border-slate-900">
    
      <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="text-[20px] font-bold">{'<'}</button>
    <p className="text-xs font-black italic uppercase text-slate-800">
      {monthName}, {year}
    </p>
      <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="text-[20px] font-bold">{'>'}</button>

    
  </div>

  <div className="grid grid-cols-7 gap-1 mt-4">
    {['S','M','T','W','T','F','S'].map((d, i) => (
      <div key={i} className="bg-slate-800 text-white text-[9px] font-bold p-1 text-center">{d}</div>
    ))}
    
    {Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      const monthStr = (viewDate.getMonth() + 1).toString().padStart(2, '0');
      const dateString = `${day.toString().padStart(2, '0')}/${monthStr}/${year}`;
      const interviewOnThisDay = interviews.find(int => int.date === dateString);
      
      return (
        <div 
          key={i} 
          onClick={() => handleCalendarClick(day)}
          className={`
            h-8 flex items-center justify-center text-[10px] font-bold border border-black/5 cursor-pointer transition-all
            ${interviewOnThisDay 
              ? 'bg-slate-900 text-white shadow-lg z-10 scale-110 ring-2 ring-indigo-400' 
              : 'bg-white text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}
          `}
        >
          {day < 10 ? `0${day}` : day}
        </div>
      );
    })}
  </div>
</div>
        </div>

        <div className=" space-y-4">
          <button onClick={toggleModal} className="w-full bg-[#2D2D2D] hover:bg-black text-white p-5 group flex items-center justify-between transition-all">
            <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📅</span>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest opacity-60 leading-none mb-1">Schedule a new</p>
              <p className="text-sm font-black uppercase tracking-tight">Interview</p>
            </div>
          </button>

          <button className="w-full bg-[#2D2D2D] hover:bg-black text-white p-5 group flex items-center justify-between transition-all">
            <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">✨</span>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest opacity-60 leading-none mb-1">Automate with</p>
              <p className="text-sm font-black uppercase tracking-tight">Next A.I.</p>
            </div>
          </button>
        </div>
      </aside>

      {/* --- THE MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleModal}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#2D2D2D] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">New Interview</h3>
              <button onClick={toggleModal} className="text-2xl leading-none hover:text-red-400">×</button>
            </div>

            <form className="p-8 space-y-5" onSubmit={handleSubmit}>
  <div>
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Company</label>
    <input 
      type="text" required value={formData.company}
      onChange={(e) => setFormData({...formData, company: e.target.value})}
      className="w-full border-b-2 border-slate-200 py-2 focus:border-slate-900 outline-none font-medium" 
    />
  </div>

  <div>
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Role</label>
    <input 
      type="text" required value={formData.role}
      onChange={(e) => setFormData({...formData, role: e.target.value})}
      className="w-full border-b-2 border-slate-200 py-2 focus:border-slate-900 outline-none font-medium" 
    />
  </div>

  <div className="grid grid-cols-2 gap-6">
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Date</label>
      <input 
        type="date" required value={formData.date}
        onChange={(e) => setFormData({...formData, date: e.target.value})}
        className="w-full border-b-2 border-slate-200 py-2 focus:border-slate-900 outline-none" 
      />
    </div>
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Color</label>
      <select 
        value={formData.color}
        onChange={(e) => setFormData({...formData, color: e.target.value})}
        className="w-full border-b-2 border-slate-200 py-2 focus:border-slate-900 outline-none bg-white"
      >
       {colorOptions.map((opt) => (
          <option key={opt.hex} value={opt.hex}>
            {opt.name}
          </option>
        ))}
      </select>

    </div>
  </div>

  {/* NEW NOTES SECTION */}
  <div>
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Notes</label>
    <textarea 
      rows="3"
      value={formData.notes}
      onChange={(e) => setFormData({...formData, notes: e.target.value})}
      placeholder="Focus on technical skills..."
      className="w-full border-2 border-slate-100 p-2 focus:border-slate-900 outline-none transition-colors text-sm resize-none"
    />
  </div>

  <button type="submit" className="w-full bg-[#2D2D2D] hover:bg-black text-white font-black uppercase tracking-widest py-4 mt-4 transition-all">
    {editingId ? 'Update Interview' : 'Confirm Schedule'}
  </button>
</form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;