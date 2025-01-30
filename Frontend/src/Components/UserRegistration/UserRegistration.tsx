import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../Hooks/AuthContext';

function UserRegistration() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (isLoginMode) {
      axios.post('http://localhost:3000/auth/signin', formData)
        .then((res) => {
          login(res.data.token);
          toast.success('Login successful!', {
            position: 'bottom-right',
            theme: 'colored'
          });
          navigate('/');
        })
        .catch((err) => {
          console.error(err);
          toast.error('Login failed', {
            position: 'bottom-right',
            theme: 'colored'
          });
        }); 
  } else {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'bottom-right',
        theme: 'colored'
      });
      return;
    }
    axios.post('http://localhost:3000/auth/signup', formData)
      .then((res) => {
        toast.success('Registration successful! Please login.', {
          position: 'bottom-right',
          theme: 'colored'
        });
        setIsLoginMode(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Registration failed', {
          position: 'bottom-right',
          theme: 'colored'
        });
      });
  }
};
  const toggleMode = () => setIsLoginMode(!isLoginMode);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLoginMode ? 'User Login' : 'User Registration'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            {isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={toggleMode}
            className="text-indigo-600 hover:underline"
          >
            {isLoginMode
              ? "Don't have an account? Register here"
              : 'Already have an account? Login here'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;
