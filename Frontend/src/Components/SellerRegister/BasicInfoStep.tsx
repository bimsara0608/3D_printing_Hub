import React from 'react';

interface BasicInfoStepProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BasicInfoStep({ formData, onChange }: BasicInfoStepProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.name}
          onChange={onChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.email}
          onChange={onChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.password}
          onChange={onChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={6}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.confirmPassword}
          onChange={onChange}
        />
      </div>
    </>
  );
}