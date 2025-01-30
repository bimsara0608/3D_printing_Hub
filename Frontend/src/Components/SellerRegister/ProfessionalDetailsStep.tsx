import React from 'react';

interface ProfessionalDetailsStepProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSkillsChange: (skill: string) => void;
}

export function ProfessionalDetailsStep({
  formData,
  onChange,
  onSkillsChange,
}: ProfessionalDetailsStepProps) {
  const skills = [
    '3D Modeling',
    'Rapid Prototyping',
    'CAD Design',
    'Product Design',
    'FDM Printing',
    'SLA Printing',
    'Post-Processing',
    'Custom Finishing'
  ];

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Experience Level</label>
        <select
          name="experience"
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.experience}
          onChange={onChange}
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner (0-2 years)</option>
          <option value="intermediate">Intermediate (2-5 years)</option>
          <option value="expert">Expert (5+ years)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="mt-2 space-y-2">
          {skills.map((skill) => (
            <label key={skill} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.skills.includes(skill)}
                onChange={() => onSkillsChange(skill)}
              />
              <span className="ml-2">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Professional Experience</label>
        <textarea
          name="professionalExperience"
          rows={4}
          className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.professionalExperience}
          onChange={onChange}
          placeholder="Describe your professional experience in 3D printing"
        />
      </div>
    </>
  );
}
