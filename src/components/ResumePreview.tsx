import React from 'react';
import { ResumeFormValues } from '@/lib/resumeSchema';

interface ResumePreviewProps {
  resume: ResumeFormValues;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  return (
    <div className="p-8 bg-white text-black font-sans text-sm shadow-lg rounded-lg" style={{ width: '210mm', minHeight: '297mm', transform: 'scale(0.9)', transformOrigin: 'top center' }}>
      <header className="text-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">{resume.fullName || "Full Name"}</h1>
        <div className="flex justify-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap">
          <p>{resume.email || "your.email@example.com"}</p>
          {resume.phone && <p>{resume.phone}</p>}
          {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">{resume.linkedin}</a>}
        </div>
      </header>

      <main>
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Professional Summary</h2>
          <p className="whitespace-pre-wrap">{resume.summary || "Your professional summary goes here..."}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Work Experience</h2>
          <p className="whitespace-pre-wrap">{resume.experience || "Your work experience goes here..."}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Education</h2>
          <p className="whitespace-pre-wrap">{resume.education || "Your education history goes here..."}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2">Skills</h2>
          <p className="whitespace-pre-wrap">{resume.skills || "Your skills go here..."}</p>
        </section>
      </main>
    </div>
  );
};

export default ResumePreview;