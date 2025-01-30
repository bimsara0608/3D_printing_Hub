import React from 'react';
import { ProfileSetupStep } from './ProfileSetupStep';
import { ProfessionalDetailsStep } from './ProfessionalDetailsStep';

interface RegistrationFormProps {
  formData: any;
  setFormData: (data: any) => void;
  step: number;
  setStep: (step: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegistrationForm({
  formData,
  setFormData,
  step,
  setStep,
  onSubmit
}: RegistrationFormProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (skill: string) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s: string) => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 2: // Skip BasicInfoStep and start with ProfileSetupStep
        return (
          <ProfileSetupStep
            formData={formData}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <ProfessionalDetailsStep
            formData={formData}
            onChange={handleChange}
            onSkillsChange={handleSkillsChange}
          />
        );
      default:
        return null;
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    // Prevent form submission on next click (when not on the last step)
    if (step < 3) {
      e.preventDefault();
      setStep(step + 1);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-8 space-y-6">
      {renderStep()}
      
      <div className="flex justify-between pt-4">
        {step > 2 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNextClick}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Complete Registration
          </button>
        )}
      </div>
    </form>
  );
}
