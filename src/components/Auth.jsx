import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signup(email, password, displayName.trim());
      }
      onAuthSuccess?.();
    } catch (error) {
      console.error('Auth error:', error);
      setError(
        error.code === 'auth/user-not-found' ? 'No account found with this email' :
        error.code === 'auth/wrong-password' ? 'Incorrect password' :
        error.code === 'auth/email-already-in-use' ? 'Email already registered' :
        error.code === 'auth/invalid-email' ? 'Invalid email address' :
        error.code === 'auth/weak-password' ? 'Password is too weak' :
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    },
    container: {
      background: 'linear-gradient(135deg, rgba(45, 45, 45, 0.98), rgba(30, 30, 30, 0.98))',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 107, 53, 0.2)',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      padding: '48px',
      width: '100%',
      maxWidth: '440px',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '900',
      background: 'linear-gradient(45deg, #ff6b35, #ffaa00)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '12px',
      textShadow: '0 4px 8px rgba(255, 107, 53, 0.3)',
      fontFamily: 'Inter, sans-serif'
    },
    subtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '16px',
      fontWeight: '500'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '18px 24px 18px 56px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 107, 53, 0.2)',
      borderRadius: '12px',
      fontSize: '16px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500'
    },
    inputFocus: {
      border: '2px solid #ff6b35',
      boxShadow: '0 0 0 4px rgba(255, 107, 53, 0.1)',
      background: 'rgba(255, 255, 255, 0.08)'
    },
    inputIcon: {
      position: 'absolute',
      left: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 107, 53, 0.7)',
      zIndex: 2
    },
    passwordToggle: {
      position: 'absolute',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.6)',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      transition: 'color 0.3s ease'
    },
    button: {
      padding: '18px 32px',
      background: 'linear-gradient(45deg, #ff6b35, #e63946)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    buttonDisabled: {
      background: '#6b7280',
      cursor: 'not-allowed',
      boxShadow: 'none'
    },
    toggleText: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.7)',
      fontSize: '15px',
      fontWeight: '500'
    },
    toggleLink: {
      color: '#ff6b35',
      cursor: 'pointer',
      fontWeight: '700',
      textDecoration: 'none',
      transition: 'color 0.3s ease'
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
      padding: '12px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px'
    },
    features: {
      marginTop: '32px',
      padding: '24px',
      background: 'rgba(255, 107, 53, 0.08)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 107, 53, 0.2)'
    },
    featuresTitle: {
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    featuresList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    feature: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>FormForge</h1>
          <p style={styles.subtitle}>
            {isLogin ? 'Welcome back to your forge' : 'Join the FormForge community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <User size={20} style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={styles.input}
                required={!isLogin}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <Mail size={20} style={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={20} style={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? (
              'Processing...'
            ) : isLogin ? (
              'Sign In'
            ) : (
              <>
                <Sparkles size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={styles.toggleLink}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>

        {!isLogin && (
          <div style={styles.features}>
            <div style={styles.featuresTitle}>
              <Sparkles size={16} />
              What you get with FormForge:
            </div>
            <div style={styles.featuresList}>
              <div style={styles.feature}>
                <CheckCircle size={14} color="#10b981" />
                Professional form builder
              </div>
              <div style={styles.feature}>
                <CheckCircle size={14} color="#10b981" />
                Beautiful PDF generation
              </div>
              <div style={styles.feature}>
                <CheckCircle size={14} color="#10b981" />
                Real-time form sharing
              </div>
              <div style={styles.feature}>
                <CheckCircle size={14} color="#10b981" />
                Analytics & submissions
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;