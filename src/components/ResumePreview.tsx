import React from 'react';
import { ResumeFormValues } from '@/lib/resumeSchema';
import { cn } from '@/lib/utils';
import { Mail, Phone, Linkedin } from 'lucide-react';

interface ResumePreviewProps {
  resume: ResumeFormValues;
  templateSlug?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, templateSlug = 'modern-minimalist' }) => {
  const { fullName, email, phone, linkedin, summary, experience, education, skills } = resume;

  const renderHeader = () => (
    <>
      <h1 className={cn(
        "font-bold",
        templateSlug === 'professional-classic' && "text-3xl tracking-widest",
        templateSlug === 'modern-minimalist' && "text-4xl",
        templateSlug === 'creative-portfolio' && "text-3xl text-primary leading-tight",
        templateSlug === 'tech-savvy' && "text-3xl text-green-400",
        templateSlug === 'academic-research' && "text-3xl",
        templateSlug === 'executive-summary' && "text-4xl text-blue-800",
      )}>{fullName || "Your Name"}</h1>
      <div className={cn(
        "flex gap-x-4 gap-y-1 text-xs mt-2 flex-wrap",
        templateSlug === 'professional-classic' && "justify-center",
        templateSlug === 'modern-minimalist' && "justify-center",
        templateSlug === 'creative-portfolio' && "flex-col !gap-y-2 mt-4",
        templateSlug === 'tech-savvy' && "justify-center text-green-300",
        templateSlug === 'academic-research' && "justify-center",
        templateSlug === 'executive-summary' && "justify-center",
      )}>
        {email && <p className="flex items-center gap-1.5"><Mail size={12} /> {email}</p>}
        {phone && <p className="flex items-center gap-1.5"><Phone size={12} /> {phone}</p>}
        {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline"><Linkedin size={12} /> LinkedIn</a>}
      </div>
    </>
  );

  const renderSection = (title: string, content: string) => (
    <section className="mb-6">
      <h2 className={cn(
        "font-bold pb-1 mb-2",
        templateSlug === 'professional-classic' && "text-lg uppercase tracking-wider border-b-2 border-gray-400",
        templateSlug === 'modern-minimalist' && "text-xl border-b-2 border-gray-300",
        templateSlug === 'creative-portfolio' && "text-lg font-semibold text-primary mt-6 mb-1 border-none",
        templateSlug === 'tech-savvy' && "text-lg text-green-400 border-b border-green-400",
        templateSlug === 'academic-research' && "text-xl font-semibold border-b border-gray-300",
        templateSlug === 'executive-summary' && "text-sm uppercase tracking-wider font-bold text-blue-800 border-b-2 border-blue-200",
      )}>{title}</h2>
      <p className="whitespace-pre-wrap text-justify text-sm">{content || `Your ${title.toLowerCase()} goes here...`}</p>
    </section>
  );

  const mainContent = (
    <>
      {summary && renderSection("Professional Summary", summary)}
      {experience && renderSection("Work Experience", experience)}
      {education && renderSection("Education", education)}
      {skills && renderSection("Skills", skills)}
    </>
  );

  if (templateSlug === 'creative-portfolio') {
    return (
      <div
        className="p-8 bg-white text-black font-sans text-sm shadow-lg rounded-lg grid grid-cols-3 gap-x-8"
        style={{ width: '210mm', minHeight: '297mm', transform: 'scale(0.9)', transformOrigin: 'top center' }}
      >
        <header className="col-span-1 text-left border-r pr-8 flex flex-col">
          {renderHeader()}
        </header>
        <main className="col-span-2">
          {mainContent}
        </main>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-8 bg-white text-black shadow-lg rounded-lg",
        templateSlug === 'professional-classic' && "font-serif",
        templateSlug === 'modern-minimalist' && "font-sans",
        templateSlug === 'tech-savvy' && "font-mono bg-gray-900 text-gray-100",
        templateSlug === 'academic-research' && "font-serif",
        templateSlug === 'executive-summary' && "font-sans",
      )}
      style={{ width: '210mm', minHeight: '297mm', transform: 'scale(0.9)', transformOrigin: 'top center' }}
    >
      <header className={cn(
        "text-center mb-8 pb-4",
        templateSlug === 'professional-classic' && "border-b-2 border-black",
        templateSlug === 'modern-minimalist' && "border-b",
        templateSlug === 'tech-savvy' && "border-b border-green-400",
        templateSlug === 'academic-research' && "border-b",
        templateSlug === 'executive-summary' && "border-b-4 border-blue-800",
      )}>
        {renderHeader()}
      </header>
      <main>
        {mainContent}
      </main>
    </div>
  );
};

export default ResumePreview;