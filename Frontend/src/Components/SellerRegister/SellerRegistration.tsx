import React, { useState } from 'react';
import { RegistrationForm } from './RegistrationForm';
import { LoginForm } from './LoginForm';
import { ProgressSteps } from './ProgressSteps';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SellerRegistration() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [step, setStep] = useState(2);
  const [formData, setFormData] = useState({
    education: '',
    description: '',
    location: '',
    skills: [] as string[],
    experience: '',
    professionalExperience: ''
  });
  const [loginData, setLoginData] = useState({
    email:'',
    password:''
  })
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      try { 
        console.log(loginData)
        await axios.post('http://localhost:3000/seller/sellerSignIn', loginData).then((res) => {
          localStorage.setItem('authToken', res.data.token);
          navigate('/');
          toast.success('Succesfull Logged in as a Seller', {position: 'bottom-right', theme: 'colored'});
          window.location.reload();
        }
        );  
      } catch (error) {
        toast.error('Error logging in as a Seller', {position: 'bottom-right', theme: 'colored'});
        return;
      } 
    } else {
      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { authorization: `Bearer ${token}` } : {};
        await axios.post('http://localhost:3000/seller/create', formData, { headers });
        toast.success('Succesfully registered as a Seller', {position: 'bottom-right', theme: 'colored'});
        setIsLoginMode(true); 
      }
      catch (error) {
        //console.error('Error:', error);
        toast.error('Error registering as a Seller', {position: 'bottom-right', theme: 'colored'});
        return;
      }     
    }
  };

  const toggleMode = () => setIsLoginMode(!isLoginMode);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            {isLoginMode ? 'Seller Login' : 'Register as a Seller'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isLoginMode 
              ? 'Welcome back! Please login to your account.' 
              : 'Start offering your 3D printing services today'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          {isLoginMode ? (
            <LoginForm loginData={loginData} setLoginData={setLoginData} onSubmit={handleSubmit} />
          ) : (
            <>
              <ProgressSteps currentStep={step} />
              <RegistrationForm
                formData={formData}
                setFormData={setFormData}
                step={step}
                setStep={setStep}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </div>

        <div className="text-center mt-4">
          <button onClick={toggleMode} className="text-indigo-600 hover:underline">
            {isLoginMode 
              ? "Don't have an account? Register here" 
              : 'Already have an account? Login here'}
          </button>
        </div>
      </div>
    </div>
  );
}
