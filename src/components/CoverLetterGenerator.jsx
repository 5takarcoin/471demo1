import { useState } from "react";
import axios from "axios";

export default function CoverLetterGenerator({ job, seekerProfile }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
  setLoading(true);
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    // fetch profile first
    const profileRes = await axios.get(`http://localhost:1008/api/profile/${user?.id}`);
    const profile = profileRes.data;

    const res = await axios.post("http://localhost:1008/api/cover-letter/generate", {
      jobTitle: job.title,
      jobDescription: job.description,
      seekerName: user?.name,
      skills: profile.skills.join(", "),
      experience: profile.experience,
    });

    setCoverLetter(res.data.coverLetter);
  } catch (err) {
  console.error("Full error:", err);
  console.error("Response:", err.response?.data);
  alert(err.response?.data?.error || err.message);
}
  setLoading(false);
};

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {coverLetter && (
        <div>
          <textarea
            rows={12}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            style={{ width: "100%" }}
          />
          <button onClick={() => navigator.clipboard.writeText(coverLetter)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}