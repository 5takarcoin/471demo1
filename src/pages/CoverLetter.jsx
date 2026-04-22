import CoverLetterGenerator from "../components/CoverLetterGenerator";


const CoverLetterPage = () => {
  return (
    <div>
      <h1>Generate Cover Letter</h1>
      <CoverLetterGenerator job={job} seekerProfile={currentUser} />
    </div>
  );
};

export default CoverLetterPage;