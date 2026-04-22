import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  const [profile, setProfile] = useState({
    phone: "", location: "", education: "", experience: "", skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:1008/api/profile/${user?.id}`)
      .then(res => setProfile(res.data))
      .catch(() => {});
  }, []);

  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !profile.skills.includes(val)) {
      setProfile(p => ({ ...p, skills: [...p.skills, val] }));
    }
    setSkillInput("");
  };

  const removeSkill = (i) => {
    setProfile(p => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:1008/api/profile/upsert", {
        userId: user?.id, ...profile,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Failed to save profile");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-medium flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block mt-1.5">
            Job Seeker
          </span>
        </div>
      </div>

      {/* Account info (readonly) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Account info</p>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full name</label>
            <input readOnly value={user?.name || ""} className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input readOnly value={user?.email || ""} className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed" />
          </div>
        </div>
        <p className="text-xs text-gray-400">Name and email are linked to your account and cannot be changed here.</p>
      </div>

      {/* Personal details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Personal details</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              placeholder="01700000000" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Location</label>
            <input value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
              placeholder="Dhaka, Bangladesh" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Education</label>
          <input value={profile.education} onChange={e => setProfile(p => ({ ...p, education: e.target.value }))}
            placeholder="BSc Computer Science, BUET" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
        </div>
      </div>

      {/* Professional background */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Professional background</p>
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">Experience summary</label>
          <textarea rows={3} value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
            placeholder="e.g. 2 years of full stack web development using React and Node.js..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-y" />
        </div>
        <hr className="border-gray-100 mb-4" />
        <label className="block text-xs text-gray-500 mb-2">Skills</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.skills.map((skill, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
              {skill}
              <button onClick={() => removeSkill(i)} className="text-blue-400 hover:text-blue-700 text-sm leading-none">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="Type a skill and press Enter"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          <button onClick={addSkill} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
            + Add
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <button onClick={handleSave} disabled={loading}
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors">
          {loading ? "Saving..." : "Save profile"}
        </button>
        {saved && <p className="text-center text-green-600 text-sm mt-2">✓ Profile saved successfully</p>}
      </div>

    </div>
  );
}