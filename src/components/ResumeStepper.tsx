import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ResumeStepperProps {
  steps: { name: string }[];
  currentStep: number;
}

const ResumeStepper: React.FC<ResumeStepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn('relative', { 'pr-8 sm:pr-20': stepIdx !== steps.length - 1 })}>
            {stepIdx < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                </div>
              </>
            )}
            <div className="absolute top-10 -left-2 w-20 text-center">
                <p className={cn("text-xs", stepIdx <= currentStep ? "text-primary font-semibold" : "text-gray-500")}>{step.name}</p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ResumeStepper;