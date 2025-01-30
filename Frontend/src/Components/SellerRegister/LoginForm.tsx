import React from 'react';

interface LoginFormProps {
  loginData: any;
  setLoginData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({ loginData, setLoginData, onSubmit }: LoginFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onSubmit} className="p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={loginData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
          value={loginData.password}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Login
      </button>
    </form>
  );
}
