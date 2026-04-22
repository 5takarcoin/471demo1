import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:1008/api/jobs/${jobId}`)
      .then(res => setJob(res.data.data || res.data))
      .catch(err => console.error(err));
  }, [jobId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const profileRes = await axios.get(`http://localhost:1008/api/profile/${user?.id}`);
      const profile = profileRes.data;

      const res = await axios.post("http://localhost:1008/api/cover-letter/generate", {
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
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm hover:bg-gray-50"
            >
              Send
            </button>
          )}
        </div>
      </div>

    </div>
  );
}