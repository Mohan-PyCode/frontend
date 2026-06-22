import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, User as UserIcon, Mail, Briefcase } from 'lucide-react';

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1566385278603-685b85a3a789?auto=format&fit=crop&w=1600&q=80', // fresh veggies
  'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80', // green vegetables
  'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1600&q=80'  // fresh inputs
];

const Login = ({ onBackToLanding }) => {
  const { login, loginWithOtp, error: authError, loading } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('farmer');

  // OTP Login States
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');
    
    if (isRegister) {
      if (!username || !password || !email) {
        setValidationError('Please fill in all fields');
        return;
      }
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, role, phone: phone || null }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
          throw new Error(errorData.detail || 'Registration failed');
        }

        setSuccessMessage('Registration successful! Please login with your credentials.');
        setIsRegister(false);
        setPassword('');
        setEmail('');
        setPhone('');
      } catch (err) {
        setValidationError(err.message);
      }
    } else {
      if (loginMode === 'password') {
        if (!username || !password) {
          setValidationError('Please fill in all fields');
          return;
        }
        await login(username, password);
      } else {
        // OTP Login Mode
        if (!identifier) {
          setValidationError('Please enter your email or phone number');
          return;
        }
        if (!otpSent) {
          try {
            const response = await fetch('/api/users/request-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ identifier }),
            });
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ detail: 'Failed to request OTP' }));
              throw new Error(errorData.detail || 'Failed to request OTP');
            }
            setOtpSent(true);
            setSuccessMessage('OTP generated! Please check your terminal console log.');
          } catch (err) {
            setValidationError(err.message);
          }
        } else {
          if (!otpCode) {
            setValidationError('Please enter the 6-digit OTP code');
            return;
          }
          await loginWithOtp(identifier, otpCode);
        }
      }
    }
  };

  const fillCredentials = (role) => {
    setIsRegister(false);
    setOtpSent(false);
    setOtpCode('');
    if (role === 'farmer') {
      if (loginMode === 'password') {
        setUsername('farmer');
        setPassword('farmer123');
      } else {
        setIdentifier('+919876543210');
      }
    } else if (role === 'agronomist') {
      if (loginMode === 'password') {
        setUsername('agronomist');
        setPassword('agro123');
      } else {
        setIdentifier('+919876543211');
      }
    } else if (role === 'admin') {
      if (loginMode === 'password') {
        setUsername('admin');
        setPassword('admin123');
      } else {
        setIdentifier('+919876543212');
      }
    }
  };

  return (
    <div className="login-carousel-bg" style={{ backgroundImage: `url(${CAROUSEL_IMAGES[currentSlide]})` }}>
      <button type="button" className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
        &larr;
      </button>
      <button type="button" className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
        &rarr;
      </button>

      <div className="login-card-white">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={styles.logoContainer}>
            <Sprout size={32} color="#10b981" />
          </div>
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'underline'
              }}
            >
              Back to Home
            </button>
          )}
        </div>

        <h1>AgriPulse</h1>
        <p className="login-subtext">AI-Powered Crop Disease Early-Warning System</p>

        {!isRegister && (
          <div style={styles.tabs}>
            <button 
              type="button" 
              onClick={() => { setLoginMode('password'); setValidationError(''); setSuccessMessage(''); setOtpSent(false); }}
              style={{ 
                ...styles.tabBtn, 
                borderBottomColor: loginMode === 'password' ? '#224b2a' : 'transparent', 
                color: loginMode === 'password' ? '#224b2a' : '#64748b',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                paddingBottom: '8px',
                fontWeight: '700'
              }}
            >
              Password
            </button>
            <button 
              type="button" 
              onClick={() => { setLoginMode('otp'); setValidationError(''); setSuccessMessage(''); }}
              style={{ 
                ...styles.tabBtn, 
                borderBottomColor: loginMode === 'otp' ? '#224b2a' : 'transparent', 
                color: loginMode === 'otp' ? '#224b2a' : '#64748b',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                paddingBottom: '8px',
                fontWeight: '700'
              }}
            >
              OTP Sign In
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {validationError && <div style={styles.alertDanger}>{validationError}</div>}
          {successMessage && <div style={styles.alertSuccess}>{successMessage}</div>}
          {authError && !isRegister && <div style={styles.alertDanger}>{authError}</div>}

          {/* PASSWORD LOGIN FORM OR REGISTER */}
          {(loginMode === 'password' || isRegister) && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrapper}>
                  <UserIcon size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-control"
                    style={styles.paddedInput}
                    required
                  />
                </div>
              </div>

              {isRegister && (
                <>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Address</label>
                    <div style={styles.inputWrapper}>
                      <Mail size={18} style={styles.inputIcon} />
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-control"
                        style={styles.paddedInput}
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number (Optional)</label>
                    <div style={styles.inputWrapper}>
                      <Mail size={18} style={styles.inputIcon} />
                      <input
                        type="text"
                        placeholder="e.g. +919876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-control"
                        style={styles.paddedInput}
                      />
                    </div>
                  </div>
                </>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-control"
                    style={styles.paddedInput}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* OTP LOGIN FORM */}
          {loginMode === 'otp' && !isRegister && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email or Phone Number</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="e.g. farmer@agripulse.com or +919876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="input-control"
                    style={styles.paddedInput}
                    disabled={otpSent}
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>6-Digit OTP Code</label>
                  <div style={styles.inputWrapper}>
                    <Lock size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="input-control"
                      style={styles.paddedInput}
                      required
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {isRegister && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>System Role</label>
              <div style={styles.inputWrapper}>
                <Briefcase size={18} style={styles.inputIcon} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-control"
                  style={{ ...styles.paddedInput, appearance: 'none' }}
                >
                  <option value="farmer">Farmer (Register plots & upload leaves)</option>
                  <option value="agronomist">Agronomist (Analyze & verify tags)</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={styles.submitBtn}>
            {loading ? 'Processing...' : isRegister ? 'Create Account' : (loginMode === 'otp' && !otpSent) ? 'Send OTP Code' : 'Sign In'}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          <button 
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setValidationError('');
              setSuccessMessage('');
            }}
            style={styles.toggleBtn}
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>Developer Roles Quick-Access</span>
        </div>

        <div style={styles.roleButtonsGrid}>
          <button type="button" onClick={() => fillCredentials('farmer')} style={styles.roleBtn} className="roleBtn">
            <span style={styles.roleBtnEmoji}>🌾</span>
            <div style={styles.roleBtnText}>
              <strong>Farmer</strong>
              <span>farmer / farmer123</span>
            </div>
          </button>
          
          <button type="button" onClick={() => fillCredentials('agronomist')} style={styles.roleBtn} className="roleBtn">
            <span style={styles.roleBtnEmoji}>🔬</span>
            <div style={styles.roleBtnText}>
              <strong>Agronomist</strong>
              <span>agronomist / agro123</span>
            </div>
          </button>

          <button type="button" onClick={() => fillCredentials('admin')} style={styles.roleBtn} className="roleBtn">
            <span style={styles.roleBtnEmoji}>⚙️</span>
            <div style={styles.roleBtnText}>
              <strong>Admin</strong>
              <span>admin / admin123</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    textAlign: 'center',
  },
  tabs: {
    display: 'flex',
    width: '100%',
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  tabBtn: {
    flex: 1,
    padding: '10px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  logoContainer: {
    background: 'rgba(16, 185, 129, 0.1)',
    padding: '16px',
    borderRadius: '50%',
    marginBottom: '16px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#e2e8f0',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#64748b',
  },
  paddedInput: {
    paddingLeft: '44px',
  },
  submitBtn: {
    width: '100%',
    marginTop: '8px',
  },
  alertDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: '14px',
  },
  alertSuccess: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#a7f3d0',
    fontSize: '14px',
  },
  toggleContainer: {
    marginTop: '16px',
    textAlign: 'center',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#10b981',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'underline',
  },
  divider: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '30px 0 20px 0',
  },
  dividerText: {
    background: '#0f172a',
    padding: '0 12px',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  roleButtonsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  roleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    color: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  roleBtnEmoji: {
    fontSize: '20px',
  },
  roleBtnText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '13px',
    '& strong': {
      fontWeight: '600',
    },
    '& span': {
      color: '#64748b',
      fontSize: '11px',
    }
  }
};

export default Login;
