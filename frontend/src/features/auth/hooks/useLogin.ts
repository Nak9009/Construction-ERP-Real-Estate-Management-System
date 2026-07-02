import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/useAuthStore';

export const useLogin = () => {
  const [email, setEmail] = useState('admin@pphousing.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await authService.login(email, password);
      setAuth(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin
  };
};
