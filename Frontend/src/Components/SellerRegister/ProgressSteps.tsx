import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = ['Basic Info', 'Profile Setup', 'Professional Details'];

  return (
    <div className="px-8 pt-8">
      <div className="flex justify-between mb-8">
        {steps.map((label, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep > idx + 1 ? 'bg-green-500 text-white' :
              currentStep === idx + 1 ? 'bg-indigo-600 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > idx + 1 ? <CheckCircle className="w-5 h-5" /> : idx + 1}
            </div>
            <span className="text-sm mt-2">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}