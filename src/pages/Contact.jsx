import React, { useState } from 'react';
import { Mail, Send, HelpCircle, Bug, PhoneCall } from 'lucide-react';

const Contact = () => {
  const [subject, setSubject] = useState('Incident');
  const [description, setDescription] = useState('');
  const [field, setField] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending support request
    setSuccess(true);
    setDescription('');
    setField('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Precision Support Center</h1>
      <p style={styles.subtitle}>Submit field issues directly to regional agronomists or report system hardware/app issues</p>

      <div style={styles.layout}>
        {/* FORM */}
        <div className="glass-panel" style={styles.formCard}>
          <h2 style={styles.cardHeader}>Submit Incident Report</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {success && (
              <div style={styles.alertSuccess}>
                🚀 Support ticket logged successfully! Our agronomists will review the crop incident history.
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Report Category</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-control"
              >
                <option value="Incident">Crop Disease / Insect Outbreak Incident</option>
                <option value="Hardware">Sensor Hardware/Telemetry Glitch</option>
                <option value="Software">Mobile App or Web Platform Bug</option>
                <option value="Other">General Agronomy Inquiry</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Affected Field / Area Location</label>
              <input
                type="text"
                placeholder="e.g. North Corn Field Plot 2"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="input-control"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Detailed Description of Symptoms or Issue</label>
              <textarea
                rows="5"
                placeholder="Please describe leaf color changes, environmental parameters, or software errors..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-control"
                style={styles.textarea}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
              <Send size={16} /> Send Ticket
            </button>
          </form>
        </div>

        {/* INFO */}
        <div style={styles.infoCol}>
          <div className="glass-panel" style={styles.infoCard}>
            <div style={styles.infoIconHeader}>
              <HelpCircle size={22} color="#10b981" />
              <h3>Help Desk Guidelines</h3>
            </div>
            <p style={styles.infoText}>
              Crop alerts submitted are pushed directly to agronomists registered under your regional cluster. Reports containing photographs should be uploaded via the <strong>Leaf Analysis</strong> page.
            </p>
          </div>

          <div className="glass-panel" style={styles.infoCard}>
            <div style={styles.infoIconHeader}>
              <Bug size={22} color="#f59e0b" />
              <h3>System Status</h3>
            </div>
            <p style={styles.infoText}>
              IoT Sensor Telemetry Gateway: <span style={styles.onlineBadge}>Online</span><br />
              PyTorch CNN Ingest API: <span style={styles.onlineBadge}>Online</span><br />
              Outbreak Risk scoring logic: <span style={styles.onlineBadge}>Active</span>
            </p>
          </div>

          <div className="glass-panel" style={styles.infoCard}>
            <div style={styles.infoIconHeader}>
              <PhoneCall size={22} color="#3b82f6" />
              <h3>Direct Helpline</h3>
            </div>
            <p style={styles.infoText}>
              Emergency crop epidemic hotline: <code style={styles.code}>+91-1800-AGRI-PULSE</code> (Toll-Free, 24/7).
            </p>
          </div>
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
    color: '#fff',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    marginBottom: '30px',
    lineHeight: '1.5',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '24px',
  },
  formCard: {
    padding: '30px',
  },
  cardHeader: {
    fontSize: '20px',
    color: '#fff',
    marginBottom: '20px',
    fontWeight: '600',
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
    color: '#e2e8f0',
  },
  textarea: {
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: 'max-content',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoCard: {
    padding: '24px',
  },
  infoIconHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
    '& h3': {
      fontSize: '16px',
      color: '#fff',
    }
  },
  infoText: {
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: '1.6',
  },
  onlineBadge: {
    color: '#10b981',
    fontWeight: '700',
  },
  code: {
    color: '#3b82f6',
    fontWeight: '600',
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  alertSuccess: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#a7f3d0',
    fontSize: '14px',
  }
};

export default Contact;
