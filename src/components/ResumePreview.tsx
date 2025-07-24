import React from 'react';
import { ResumeFormValues } from '@/lib/resumeSchema';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  resume: ResumeFormValues;
  templateSlug?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, templateSlug = 'modern-minimalist' }) => {
  const isClassic = templateSlug === 'professional-classic';

  return (
    <div
      className={cn(
        "p-8 bg-white text-black font-sans text-sm shadow-lg rounded-lg",
        isClassic ? "font-serif" : "font-sans"
      )}
      style={{ width: '210mm', minHeight: '297mm', transform: 'scale(0.9)', transformOrigin: 'top center' }}
    >
      <header className={cn(
        "text-center mb-8 pb-4",
        isClassic ? "border-b-2 border-black" : "border-b"
      )}>
        <h1 className={cn(
          "font-bold",
          isClassic ? "text-3xl tracking-widest" : "text-4xl"
        )}>{resume.fullName || "Full Name"}</h1>
        <div className="flex justify-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap">
          <p>{resume.email || "your.email@example.com"}</p>
          {resume.phone && <p>{resume.phone}</p>}
          {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">{resume.linkedin}</a>}
        </div>
      </header>

      <main>
        <section className="mb-6">
          <h2 className={cn(
            "font-bold pb-1 mb-2",
            isClassic ? "text-lg uppercase tracking-wider border-b-2 border-gray-400" : "text-xl border-b-2 border-gray-300"
          )}>Professional Summary</h2>
          <p className="whitespace-pre-wrap text-justify">{resume.summary || "Your professional summary goes here..."}</p>
        </section>

        <section className="mb-6">
          <h2 className={cn(
            "font-bold pb-1 mb-2",
            isClassic ? "text-lg uppercase tracking-wider border-b-2 border-gray-400" : "text-xl border-b-2 border-gray-300"
          )}>Work Experience</h2>
          <p className="whitespace-pre-wrap">{resume.experience || "Your work experience goes here..."}</p>
        </section>

        <section className="mb-6">
          <h2 className={cn(
            "font-bold pb-1 mb-2",
            isClassic ? "text-lg uppercase tracking-wider border-b-2 border-gray-400" : "text-xl border-b-2 border-gray-300"
          )}>Education</h2>
          <p className="whitespace-pre-wrap">{resume.education || "Your education history goes here..."}</p>
        </section>

        <section>
          <h2 className={cn(
            "font-bold pb-1 mb-2",
            isClassic ? "text-lg uppercase tracking-wider border-b-2 border-gray-400" : "text-xl border-b-2 border-gray-300"
          )}>Skills</h2>
          <p className="whitespace-pre-wrap">{resume.skills || "Your skills go here..."}</p>
        </section>
      </main>
    </div>
  );
};

export default ResumePreview;