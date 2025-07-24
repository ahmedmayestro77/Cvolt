import React from 'react';
import { Resume } from '@/hooks/use-resumes';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  return (
    <div className="p-8 bg-white text-black font-sans text-sm" style={{ width: '210mm', minHeight: '297mm' }}>
      <header className="text-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">{resume.fullName}</h1>
        <div className="flex justify-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap">
          <p>{resume.email}</p>
          {resume.phone && <p>{resume.phone}</p>}
          {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">{resume.linkedin}</a>}
        </div>
      </header>

      <main>
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Professional Summary</h2>
          <p className="whitespace-pre-wrap">{resume.summary}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Work Experience</h2>
          <p className="whitespace-pre-wrap">{resume.experience}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Education</h2>
          <p className="whitespace-pre-wrap">{resume.education}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Skills</h2>
          <p className="whitespace-pre-wrap">{resume.skills}</p>
        </section>
      </main>
    </div>
  );
};

export default ResumePreview;