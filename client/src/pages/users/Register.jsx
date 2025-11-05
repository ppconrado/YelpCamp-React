import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import { useFlash } from '../../context/FlashContext';
import { useAuth } from '../../context/AuthContext';
import CenteredCard from '../../components/ui/CenteredCard';
import FormInput from '../../components/ui/FormInput';
import SubmitButton from '../../components/ui/SubmitButton';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showFlash } = useFlash();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(formData);
      login(response.user); // Assume que o backend faz o login automático após o registro
      showFlash(response.message, 'success');
      navigate('/campgrounds');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Erro ao registrar usuário.';
      showFlash(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredCard
      title="Create account"
      subtitle="Registre-se para começar a compartilhar seus campings favoritos"
      footer={
        <p className="mb-0">
          Já tem conta? <Link to="/login">Entre</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="validated-form" noValidate>
        <FormInput
          id="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          autoFocus
        />
        <FormInput
          id="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <FormInput
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          rightSlot={
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />
        <SubmitButton loading={loading}>Register</SubmitButton>
      </form>
    </CenteredCard>
  );
};

export default Register;
