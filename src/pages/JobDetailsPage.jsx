import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

const handleSend = async (letter) => {
  setSending(true);
  try {
    await axios.post(`${BASE_URL}/api/applications/apply`, {
      jobId: job._id,
      applicantId: user?.id,
      employerId: job.employerId,
      coverLetter: letter,
      applicantName: user?.name,
      jobTitle: job.jobTitle,
    });
    setSent(true);
  } catch (err) {
    if (err.response?.data?.message === "Already applied to this job") {
      alert("You have already applied to this job!");
    } else {
      alert("Failed to send application");
    }
  }
  setSending(false);
};

  useEffect(() => {
    axios.get(`${BASE_URL}/api/jobs/${jobId}`)
      .then(res => setJob(res.data.data || res.data))
      .catch(err => console.error(err));
  }, [jobId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const profileRes = await axios.get(`${BASE_URL}/api/profile/${user?.id}`);
      const profile = profileRes.data;

      const res = await axios.post(`${BASE_URL}/api/cover-letter/generate`, {
        jobTitle: job.jobTitle,
        jobDescription: job.description,
        seekerName: user?.name,
        skills: profile.skills.join(", "),
        experience: profile.experience,
      });

      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      alert("Failed to generate cover letter");
    }
    setGenerating(false);
  };

  if (!job) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">

      {/* Job info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-medium text-blue-700"><span className="text-black">{job.jobTitle}</span></h1>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{job.jobType}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{job.location}</span>
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">{job.status}</span>
            </div>
          </div>
          {job.salary?.min && (
            <p className="text-sm font-medium text-gray-700">
              {job.salary.currency} {job.salary.min.toLocaleString()} – {job.salary.max.toLocaleString()}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">{job.description}</p>

        {job.requiredSkills?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Required skills</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {job.qualifications?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Qualifications</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {job.qualifications.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Cover letter section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Cover letter</p>

        <textarea
          rows={10}
          value={coverLetter}
          onChange={e => setCoverLetter(e.target.value)}
          placeholder="Write your cover letter here, or click Generate to create one with AI..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-gray-400 resize-y mb-3"
        />

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex-1 bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {generating ? "Generating..." : "✨ Generate with AI"}
          </button>

          {coverLetter && (
  <button
    onClick={() => handleSend(coverLetter)}
    disabled={sending || sent}
    className={`border rounded-lg px-4 py-2.5 text-sm transition-colors
      ${sent 
        ? "border-green-200 bg-green-50 text-green-700" 
        : "border-gray-200 hover:bg-gray-50"}`}
  >
    {sending ? "Sending..." : sent ? "✓ Sent!" : "Send"}
  </button>
)}
        </div>
      </div>

    </div>
  );
}