import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useFlash } from '../../context/FlashContext';
import { useAuth } from '../../context/AuthContext';
import CenteredCard from '../../components/ui/CenteredCard';
import FormInput from '../../components/ui/FormInput';
import SubmitButton from '../../components/ui/SubmitButton';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showFlash } = useFlash();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      const response = await loginUser(formData);
      login(response.user);
      showFlash(response.message, 'success');
      const redirectTo = location.state?.from?.pathname || '/campgrounds';
      navigate(redirectTo);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.';
      showFlash(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredCard
      title="Login"
      subtitle="Acesse sua conta para criar e revisar campings"
      footer={
        <p className="mb-0">
          Novo por aqui? <Link to="/register">Crie sua conta</Link>
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
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
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
        <SubmitButton loading={loading}>Login</SubmitButton>
      </form>
    </CenteredCard>
  );
};

export default Login;
