import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login, register, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    let res;
    if (isLogin) {
      res = await login(formData.username, formData.password);
    } else {
      res = await register(formData.username, formData.password);
    }

    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-card auth-card">
        <h2 className="auth-title">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your details to access your progress' : 'Start your journey into Data Structures'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              name="username" 
              className="form-input" 
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            className="toggle-auth-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ username: '', password: '' });
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>


        <div className="google-auth-divider">
          <span>OR</span>
        </div>

        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const res = await googleLogin(credentialResponse.credential);
              if (!res.success) {
                setError(res.error);
              }
            }}
            onError={() => {
              setError('Google Login Failed');
            }}
            theme="filled_black"
            shape="pill"
            width="300"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
