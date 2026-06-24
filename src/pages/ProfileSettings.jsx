import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { User, Mail, Phone, Shield, Save, RefreshCw } from 'lucide-react';

const ProfileSettings = () => {
  const { user, authenticatedFetch } = useAuth();
  const { lang, setLang, t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await authenticatedFetch('/api/users/me');
      if (res.ok) {
        const json = await res.json();
        setProfile(json);
        setEmail(json.email);
        setPhone(json.phone || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await authenticatedFetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.username,
          role: profile.role,
          email: email,
          phone: phone || null
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setMessage('Profile settings updated successfully!');
      } else {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}><RefreshCw className="spin" size={32} color="#10b981" /></div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Account Profile & Settings</h1>
      <p style={styles.subtitle}>Manage your crop monitoring settings and contact credentials</p>

      <div style={styles.layout}>
        {/* INFO CARD */}
        <div className="glass-panel" style={styles.card}>
          <h2 style={styles.sectionHeader}>Profile Summary</h2>
          <div style={styles.metaList}>
            <div style={styles.metaItem}>
              <User size={18} color="#64748b" />
              <div>
                <span style={styles.metaLabel}>Username</span>
                <strong style={styles.metaVal}>{profile?.username}</strong>
              </div>
            </div>

            <div style={styles.metaItem}>
              <Shield size={18} color="#10b981" />
              <div>
                <span style={styles.metaLabel}>Security Access Role</span>
                <strong style={{ ...styles.metaVal, color: '#10b981', textTransform: 'uppercase' }}>{profile?.role}</strong>
              </div>
            </div>

            <div style={styles.metaItem}>
              <Mail size={18} color="#64748b" />
              <div>
                <span style={styles.metaLabel}>System Email</span>
                <span style={styles.metaVal}>{profile?.email}</span>
              </div>
            </div>

            {profile?.phone && (
              <div style={styles.metaItem}>
                <Phone size={18} color="#64748b" />
                <div>
                  <span style={styles.metaLabel}>Registered Phone</span>
                  <span style={styles.metaVal}>{profile?.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SETTINGS FORM */}
        <div className="glass-panel" style={styles.card}>
          <h2 style={styles.sectionHeader}>{t('nav_settings')}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {message && <div style={styles.alertSuccess}>{message}</div>}
            {error && <div style={styles.alertDanger}>{error}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('lbl_email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-control"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number (For OTP Login)</label>
              <input
                type="text"
                placeholder="e.g. +919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-control"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Application Language / भाषा का चयन</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="input-control"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={styles.saveBtn}>
              <Save size={16} />
              {saving ? 'Saving Settings...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 0',
  },
  title: {
    fontSize: '28px',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginBottom: '30px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.2fr',
    gap: '24px',
  },
  card: {
    padding: '30px',
  },
  sectionHeader: {
    fontSize: '20px',
    color: 'var(--text-primary)',
    marginBottom: '20px',
    fontWeight: '600',
  },
  metaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  metaLabel: {
    fontSize: '11px',
    color: '#64748b',
    display: 'block',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metaVal: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
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
    color: 'var(--text-secondary)',
  },
  saveBtn: {
    width: 'max-content',
    marginTop: '10px',
  },
  alertSuccess: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#10b981',
    fontSize: '14px',
  },
  alertDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#dc2626',
    fontSize: '14px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
  }
};

export default ProfileSettings;
