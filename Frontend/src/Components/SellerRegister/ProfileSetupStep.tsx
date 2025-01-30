import React from 'react';

interface ProfileSetupStepProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ProfileSetupStep({ formData, onChange }: ProfileSetupStepProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Educational Qualifications</label>
        <textarea
          rows={4}
          name="education"
          className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.education}
          onChange={onChange}
          placeholder="Enter your educational qualifications"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">About</label>
        <textarea
          name="description"
          rows={4}
          className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.description}
          onChange={onChange}
          placeholder="Tell us about your 3D printing experience and services..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.location}
          onChange={onChange}
          placeholder="City, Country"
        />
      </div>
    </>
  );
}
