import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

export default function RecommendationsPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/jobs/recommendations/${user?.id}`)
      .then(res => setJobs(res.data.data))
      .catch(err => {
        if (err.response?.status === 404) setNoProfile(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <p className="text-gray-400 animate-pulse">Finding best matches for you...</p>
    </div>
  );

  if (noProfile) return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <p className="text-gray-500 mb-3">No skills found in your profile.</p>
      <button onClick={() => navigate("/profile")}
        className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-700">
        Update Profile
      </button>
    </div>
  );

  if (jobs.length === 0) return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center text-gray-400">
      No matching jobs found based on your skills.
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Recommended for you</h1>
        <p className="text-sm text-gray-400 mt-1">Personalized by AI based on your profile</p>
      </div>

      <div className="space-y-3">
        {jobs.map(job => (
          <div key={job._id}
            onClick={() => navigate(`/jobs/${job._id}`)}
            className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-gray-400 transition-colors">

            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-base font-medium text-gray-900">{job.jobTitle}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{job.location} · {job.jobType}</p>
              </div>
              <div className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full
                ${job.matchScore >= 75 ? "bg-green-50 text-green-700" :
                  job.matchScore >= 50 ? "bg-blue-50 text-blue-700" :
                  "bg-gray-100 text-gray-600"}`}>
                {job.matchScore}% match
              </div>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {job.requiredSkills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {skill}
                </span>
              ))}
            </div>

            {job.reason && (
              <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                ✨ {job.reason}
              </p>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}