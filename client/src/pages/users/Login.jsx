import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useFlash } from '../../context/FlashContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
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
      const response = await loginUser(formData);
      login(response.user);
      showFlash(response.message, 'success');
      navigate('/campgrounds');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.';
      showFlash(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <h1 className="text-center">Login</h1>
      <div className="col-6 offset-3">
        <form onSubmit={handleSubmit} className="validated-form" noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              className="form-control"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-success btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
