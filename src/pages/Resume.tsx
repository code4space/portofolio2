import resumePdf from '../assets/Resume - William.pdf?url';

const Resume = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-linear-to-br from-[#0a0a1f] via-[#150a2e] to-[#0a0a1f]">
      <iframe
        src={resumePdf}
        className="w-full h-full border-0"
        title="Resume PDF"
      />
    </div>
  );
};

export default Resume;

