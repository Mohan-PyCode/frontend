import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, User as UserIcon, Mail, Briefcase } from 'lucide-react';

const CAROUSEL_IMAGES = [
  'https://png.pngtree.com/thumb_back/fw800/background/20240925/pngtree-green-field-with-lines-of-crops-with-blur-bckground-on-sunny-image_16252105.jpg'
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

      <div className="login-card-glass">
        {/* Top left circular green plant sprout logo, title and subtitle; Back to Home link top right */}
        <div style={styles.headerRow}>
          <div style={styles.logoTitleGroup}>
            <div style={styles.logoContainer}>
              <Sprout size={22} color="#166534" />
            </div>
            <div style={styles.titleSubtitleGroup}>
              <h1 style={styles.title}>AgriPulse</h1>
              <p style={styles.subtitle}>AI-Powered Crop Disease Early-Warning System</p>
            </div>
          </div>
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              style={styles.backToHomeBtn}
            >
              Back to Home
            </button>
          )}
        </div>

        {!isRegister && (
          <div style={styles.tabs}>
            <button 
              type="button" 
              onClick={() => { setLoginMode('password'); setValidationError(''); setSuccessMessage(''); setOtpSent(false); }}
              style={{ 
                ...styles.tabBtn, 
                borderBottomColor: loginMode === 'password' ? '#166534' : 'transparent', 
                color: loginMode === 'password' ? '#166534' : '#64748b',
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
                borderBottomColor: loginMode === 'otp' ? '#166534' : 'transparent', 
                color: loginMode === 'otp' ? '#166534' : '#64748b',
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
          <button type="button" onClick={() => fillCredentials('farmer')} style={styles.roleBtn}>
            <span style={styles.roleBtnEmoji}>🌾</span>
            <div style={styles.roleBtnText}>
              <strong style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>Farmer</strong>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>farmer / farmer123</span>
            </div>
          </button>
          
          <button type="button" onClick={() => fillCredentials('agronomist')} style={styles.roleBtn}>
            <span style={styles.roleBtnEmoji}>🔬</span>
            <div style={styles.roleBtnText}>
              <strong style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>Agronomist</strong>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>agro / agro123</span>
            </div>
          </button>

          <button type="button" onClick={() => fillCredentials('admin')} style={styles.roleBtn}>
            <span style={styles.roleBtnEmoji}>⚙️</span>
            <div style={styles.roleBtnText}>
              <strong style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>Admin</strong>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>admin / admin123</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    width: '100%',
  },
  logoTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoContainer: {
    background: 'rgba(22, 101, 52, 0.08)',
    padding: '8px',
    borderRadius: '50%',
    border: '1px solid rgba(22, 101, 52, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSubtitleGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.2',
    fontFamily: "'Outfit', sans-serif",
  },
  subtitle: {
    fontSize: '10px',
    color: '#475569',
    margin: '2px 0 0 0',
    fontFamily: "'Inter', sans-serif",
  },
  backToHomeBtn: {
    background: 'none',
    border: 'none',
    color: '#166534',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    textDecoration: 'underline',
    padding: 0,
  },
  tabs: {
    display: 'flex',
    width: '100%',
    marginBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
  },
  tabBtn: {
    flex: 1,
    padding: '10px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    width: '100%',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    textAlign: 'left',
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
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    border: '1px solid #cbd5e1',
    color: '#0f172a',
    borderRadius: '8px',
    paddingTop: '12px',
    paddingBottom: '12px',
    fontSize: '14px',
  },
  submitBtn: {
    width: '100%',
    marginTop: '6px',
    background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
    border: '1px solid rgba(22, 101, 52, 0.2)',
    color: '#ffffff',
    fontWeight: '600',
    padding: '12px 24px',
    fontSize: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(22, 101, 52, 0.15)',
  },
  alertDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#991b1b',
    fontSize: '13px',
    textAlign: 'left',
  },
  alertSuccess: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#065f46',
    fontSize: '13px',
    textAlign: 'left',
  },
  toggleContainer: {
    marginTop: '12px',
    textAlign: 'center',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#166534',
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
    margin: '24px 0 16px 0',
    width: '100%',
  },
  dividerText: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '0 10px',
    fontSize: '10px',
    color: '#166534',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  roleButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    width: '100%',
  },
  roleBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
    padding: '10px 4px',
    background: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  roleBtnEmoji: {
    fontSize: '18px',
  },
  roleBtnText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    textAlign: 'center',
  }
};

export default Login;
