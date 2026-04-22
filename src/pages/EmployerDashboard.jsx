import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE = "http://localhost:1008";

export default function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [scheduleForm, setScheduleForm] = useState({
    date: "", role: "", notes: "", color: "#B4B9E8"
  });
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    // fetch employer's jobs
    axios.get(`${BASE}/api/jobs/employer/${user?.id}`)
      .then(res => setJobs(res.data.data || res.data))
      .catch(err => console.error(err));

    // fetch all applications for this employer
    axios.get(`${BASE}/api/applications/employer/${user?.id}`)
      .then(res => setApplications(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleStatusChange = async (applicationId, status) => {
    try {
      await axios.patch(`${BASE}/api/applications/${applicationId}/status`, { status });
      setApplications(prev => prev.map(a =>
        a._id === applicationId ? { ...a, status } : a
      ));
      if (selectedApplicant?._id === applicationId) {
        setSelectedApplicant(prev => ({ ...prev, status }));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

 const handleSchedule = async () => {
  setScheduling(true);
  try {
    await axios.post(`http://localhost:1008/api/interview`, {
      applicantId: selectedApplicant.applicantId,
      employerId: user?.id,
      jobId: selectedApplicant.jobId,
      company: user?.name,
      role: selectedApplicant.jobTitle,
      date: scheduleForm.date,
      notes: scheduleForm.notes,
      color: scheduleForm.color,
    });
    setScheduled(true);
    setTimeout(() => {
      setShowSchedule(false);
      setScheduled(false);
      setScheduleForm({ date: "", role: "", notes: "", color: "#B4B9E8" });
    }, 1500);
  } catch (err) {
    console.error("Schedule error:", err.response?.data);
    alert(err.response?.data?.message || "Failed to schedule interview");
  }
  setScheduling(false);
};
  const filteredApps = selectedJob
    ? applications.filter(a => a.jobId === selectedJob._id)
    : applications;

  const statusColor = (status) => {
    switch (status) {
      case "Applied": return "bg-blue-50 text-blue-700";
      case "Shortlisted": return "bg-yellow-50 text-yellow-700";
      case "Interview": return "bg-purple-50 text-purple-700";
      case "Rejected": return "bg-red-50 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900"><span className="text-black">Employer Dashboard</span></h1>
          <p className="text-sm text-gray-400">{user?.name} · {user?.email}</p>
        </div>
        <button onClick={() => { localStorage.clear(); navigate("/login"); }}
          className="text-sm text-gray-400 hover:text-gray-700">
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Jobs", value: jobs.length },
            { label: "Total Applicants", value: applications.length },
            { label: "Shortlisted", value: applications.filter(a => a.status === "Shortlisted").length },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-medium text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
          {["jobs", "applicants"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors
                ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="grid grid-cols-1 gap-3">
            {jobs.length === 0 && (
              <p className="text-gray-400 text-sm py-8 text-center">No job postings found.</p>
            )}
            {jobs.map(job => (
              <div key={job._id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-medium text-gray-900">{job.jobTitle}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{job.location} · {job.jobType}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {job.requiredSkills?.slice(0, 4).map((s, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                    ${job.status === "Open" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {job.status}
                  </span>
                  <button
                    onClick={() => { setSelectedJob(job); setActiveTab("applicants"); }}
                    className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    View Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === "applicants" && (
          <div className="flex gap-4">

            {/* Applicants list */}
            <div className="w-80 flex-shrink-0 space-y-2">
              {selectedJob && (
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setSelectedJob(null)}
                    className="text-xs text-gray-400 hover:text-gray-700">← All jobs</button>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-600 font-medium">{selectedJob.jobTitle}</span>
                </div>
              )}

              {filteredApps.length === 0 && (
                <p className="text-gray-400 text-sm py-8 text-center">No applicants yet.</p>
              )}

              {filteredApps.map(app => (
                <div key={app._id}
                  onClick={() => setSelectedApplicant(app)}
                  className={`bg-white border rounded-xl p-4 cursor-pointer transition-colors
                    ${selectedApplicant?._id === app._id
                      ? "border-gray-400"
                      : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                        {app.applicantName?.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{app.applicantName}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 ml-10">{app.jobTitle}</p>
                </div>
              ))}
            </div>

            {/* Applicant detail */}
            {selectedApplicant ? (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-medium">
                      {selectedApplicant.applicantName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-base font-medium text-gray-900">{selectedApplicant.applicantName}</h2>
                      <p className="text-sm text-gray-400">{selectedApplicant.jobTitle}</p>
                    </div>
                  </div>

                  {/* Status selector */}
                  <select
                    value={selectedApplicant.status}
                    onChange={e => handleStatusChange(selectedApplicant._id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
                    {["Applied", "Shortlisted", "Interview", "Rejected"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Cover letter */}
                <div className="mb-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Cover Letter</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedApplicant.coverLetter}
                  </div>
                </div>

                {/* Schedule interview */}
                {!showSchedule ? (
                  <button onClick={() => setShowSchedule(true)}
                    className="w-full border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
                    + Schedule Interview
                  </button>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Schedule Interview</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
  <div>
    <label className="block text-xs text-gray-500 mb-1">Date</label>
    <input type="date"
      value={scheduleForm.date.split('T')[0] || ''}
      onChange={e => setScheduleForm(p => ({ ...p, date: e.target.value + 'T' + (p.date.split('T')[1] || '10:00') }))}
      min={new Date().toISOString().split('T')[0]}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
  </div>
  <div>
    <label className="block text-xs text-gray-500 mb-1">Time</label>
    <input type="time"
      value={scheduleForm.date.split('T')[1] || ''}
      onChange={e => setScheduleForm(p => ({ ...p, date: (p.date.split('T')[0] || '') + 'T' + e.target.value }))}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
  </div>
</div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Notes</label>
                        <textarea rows={2}
                          value={scheduleForm.notes}
                          onChange={e => setScheduleForm(p => ({ ...p, notes: e.target.value }))}
                          placeholder="e.g. Zoom link, topics to discuss..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSchedule} disabled={scheduling || !scheduleForm.date}
                          className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
                          {scheduling ? "Scheduling..." : scheduled ? "✓ Scheduled!" : "Confirm Schedule"}
                        </button>
                        <button onClick={() => setShowSchedule(false)}
                          className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-300 text-sm">
                Select an applicant to view details
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}