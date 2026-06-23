import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { 
  TrendingUp, AlertTriangle, Activity, Image as ImageIcon, 
  RefreshCw, PlusCircle, Check, X, ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, authenticatedFetch } = useAuth();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Field creation form
  const [showAddField, setShowAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldCrop, setFieldCrop] = useState('Corn');
  const [fieldLocation, setFieldLocation] = useState('');

  // Fetch Dashboard Summary
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await authenticatedFetch('/api/dashboard/summary');
      if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
      const json = await res.json();
      setData(json);

      // Fetch Fields
      const fieldsRes = await authenticatedFetch('/api/predictions/fields');
      if (fieldsRes.ok) {
        const fieldsJson = await fieldsRes.json();
        setFields(fieldsJson);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Trigger Outbreak Risk Prediction
  const runPrediction = async (fieldId) => {
    try {
      const res = await authenticatedFetch(`/api/predictions/run/${fieldId}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Early-warning analysis executed successfully!');
        fetchDashboardData();
      } else {
        alert('Failed to trigger analysis.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Field
  const handleAddFieldSubmit = async (e) => {
    e.preventDefault();
    if (!fieldName || !fieldLocation) return;
    try {
      const res = await authenticatedFetch('/api/predictions/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fieldName,
          crop_type: fieldCrop,
          location: fieldLocation
        })
      });
      if (res.ok) {
        setFieldName('');
        setFieldLocation('');
        setShowAddField(false);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verify Diagnosis (Agronomist only)
  const handleVerify = async (uploadId, status, disease) => {
    try {
      const res = await authenticatedFetch(`/api/classification/${uploadId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, verified_disease: disease })
      });
      if (res.ok) {
        alert(`Diagnosis marked as ${status}`);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !data) {
    return <div style={styles.loadingContainer}><RefreshCw className="spin" size={36} color="#10b981" /></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcomeText}>{t('welcome_back')}, {user?.username}</h1>
          <p style={styles.subtext}>{t('role_label')}: <span style={styles.roleTag}>{user?.role}</span></p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-secondary">
          <RefreshCw size={16} /> {t('btn_refresh')}
        </button>
      </div>

      {error && <div style={styles.alertDanger}>{error}</div>}

      {/* KPI GRID */}
      {data && (
        <div className="dashboard-grid">
          <div className="glass-panel metric-card" style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span className="metric-title">{t('kpi_fields')}</span>
              <Activity size={20} color="#10b981" />
            </div>
            <span className="metric-value">{data.kpis.total_fields}</span>
          </div>

          <div className="glass-panel metric-card" style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span className="metric-title">{t('kpi_alerts')}</span>
              <AlertTriangle size={20} color={data.kpis.active_alerts > 0 ? '#ef4444' : '#64748b'} />
            </div>
            <span className="metric-value" style={data.kpis.active_alerts > 0 ? {color: '#ef4444'} : {}}>
              {data.kpis.active_alerts}
            </span>
          </div>

          <div className="glass-panel metric-card" style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span className="metric-title">{t('kpi_risk')}</span>
              <TrendingUp size={20} color="#f59e0b" />
            </div>
            <div>
              <span className="metric-value">{Math.round(data.kpis.average_risk * 100)}%</span>
              <div style={styles.progressBarBg}>
                <div style={{...styles.progressBarFill, width: `${data.kpis.average_risk * 100}%`}}></div>
              </div>
            </div>
          </div>

          <div className="glass-panel metric-card" style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span className="metric-title">{t('kpi_analyzed')}</span>
              <ImageIcon size={20} color="#3b82f6" />
            </div>
            <span className="metric-value">{data.kpis.images_analyzed}</span>
          </div>
        </div>
      )}

      <div style={styles.mainGrid}>
        {/* FIELDS & PREDICTIONS PANEL */}
        <div style={styles.leftCol}>
          <div className="glass-panel" style={styles.sectionPanel}>
            <div style={styles.panelHeader}>
              <h2>Registered Crops & Warnings</h2>
              {user?.role === 'farmer' && (
                <button onClick={() => setShowAddField(!showAddField)} className="btn btn-primary" style={styles.smallBtn}>
                  <PlusCircle size={16} /> Add Field
                </button>
              )}
            </div>

            {showAddField && (
              <form onSubmit={handleAddFieldSubmit} style={styles.addFieldForm} className="glass-panel">
                <input 
                  type="text" 
                  placeholder="Field Name (e.g. East Corn Hill)" 
                  value={fieldName} 
                  onChange={(e) => setFieldName(e.target.value)}
                  className="input-control"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Location coordinates/description" 
                  value={fieldLocation} 
                  onChange={(e) => setFieldLocation(e.target.value)}
                  className="input-control"
                  required
                />
                <select 
                  value={fieldCrop} 
                  onChange={(e) => setFieldCrop(e.target.value)}
                  className="input-control"
                >
                  <option value="Corn">Corn</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Rice">Rice</option>
                </select>
                <div style={styles.formActions}>
                  <button type="submit" className="btn btn-primary" style={styles.smallBtn}>Save</button>
                  <button type="button" onClick={() => setShowAddField(false)} className="btn btn-secondary" style={styles.smallBtn}>Cancel</button>
                </div>
              </form>
            )}

            <div style={styles.fieldsList}>
              {fields.length === 0 ? (
                <p style={styles.emptyText}>No registered fields found.</p>
              ) : (
                fields.map((field) => {
                  const latestPred = data?.recent_predictions.find(p => p.field_id === field.id);
                  return (
                    <div key={field.id} style={styles.fieldItem} className="glass-panel">
                      <div style={styles.fieldMeta}>
                        <h3>{field.name}</h3>
                        <p>Crop: <strong>{field.crop_type}</strong> | {field.location}</p>
                        {latestPred && (
                          <div style={styles.riskBadgeWrapper}>
                            <span style={{
                              ...styles.riskBadge,
                              backgroundColor: latestPred.risk_score > 0.75 ? 'rgba(239, 68, 68, 0.15)' : latestPred.risk_score > 0.45 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              borderColor: latestPred.risk_score > 0.75 ? '#ef4444' : latestPred.risk_score > 0.45 ? '#f59e0b' : '#10b981',
                              color: latestPred.risk_score > 0.75 ? '#fca5a5' : latestPred.risk_score > 0.45 ? '#fcd34d' : '#a7f3d0'
                            }}>
                              Outbreak Risk: {Math.round(latestPred.risk_score * 100)}%
                            </span>
                            <span style={styles.recommendationText}>{latestPred.recommendation}</span>
                          </div>
                        )}
                      </div>
                      <button onClick={() => runPrediction(field.id)} className="btn btn-primary" style={styles.triggerBtn}>
                        Run Risk AI
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* AGRONOMIST & MOISTURE SECTION */}
        <div style={styles.rightCol}>
          {/* AGRONOMIST PENDING REVIEW SECTION */}
          {(user?.role === 'agronomist' || user?.role === 'admin') && data && (
            <div className="glass-panel" style={styles.sectionPanel}>
              <h2>Agronomist Diagnostic Verification</h2>
              <p style={styles.sectionSub}>Confirm or reject machine learning leaves classification flags</p>
              
              <div style={styles.reviewList}>
                {data.recent_uploads.filter(u => u.status === 'pending').length === 0 ? (
                  <p style={styles.emptyText}>🎉 No pending diagnosis reports to verify!</p>
                ) : (
                  data.recent_uploads.filter(u => u.status === 'pending').map((upload) => (
                    <div key={upload.id} style={styles.reviewItem} className="glass-panel">
                      <div style={styles.reviewMeta}>
                        <p>File: <strong>{upload.filename}</strong></p>
                        <p>ML Detected: <span style={styles.highlightText}>{upload.disease_detected || 'Unknown'}</span> ({Math.round((upload.confidence || 0) * 100)}%)</p>
                      </div>
                      <div style={styles.verifyActions}>
                        <button 
                          onClick={() => handleVerify(upload.id, 'verified', upload.disease_detected || 'Unknown')} 
                          className="btn btn-primary" 
                          style={styles.verifyActionBtn}
                        >
                          <Check size={14} /> Verify
                        </button>
                        <button 
                          onClick={() => {
                            const newDisease = prompt('Override Diagnosis details:', upload.disease_detected || 'Unknown');
                            if (newDisease) handleVerify(upload.id, 'verified', newDisease);
                          }} 
                          className="btn btn-secondary" 
                          style={styles.verifyActionBtn}
                        >
                          Override
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TELEMETRY READINGS PANEL */}
          <div className="glass-panel" style={styles.sectionPanel}>
            <h2>Field Sensor Telemetry Logs</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Temp</th>
                    <th>Humidity</th>
                    <th>Moisture</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recent_sensor_data.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={styles.emptyTable}>No sensor data logged yet.</td>
                    </tr>
                  ) : (
                    data?.recent_sensor_data.map((sensor) => (
                      <tr key={sensor.id}>
                        <td>{new Date(sensor.timestamp).toLocaleTimeString()}</td>
                        <td>{sensor.temperature.toFixed(1)}°C</td>
                        <td>{sensor.humidity.toFixed(0)}%</td>
                        <td>{sensor.soil_moisture.toFixed(0)}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  welcomeText: {
    fontSize: '28px',
    color: 'var(--text-primary)',
  },
  subtext: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginTop: '4px',
  },
  roleTag: {
    fontWeight: '700',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  alertDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#dc2626',
    marginBottom: '24px',
  },
  metricCard: {
    flex: 1,
    height: '115px',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarBg: {
    background: 'rgba(0, 0, 0, 0.06)',
    height: '6px',
    borderRadius: '3px',
    width: '100%',
    marginTop: '8px',
    overflow: 'hidden',
  },
  progressBarFill: {
    background: 'linear-gradient(90deg, #f59e0b, #10b981)',
    height: '100%',
    borderRadius: '3px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '24px',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionPanel: {
    padding: '24px',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  smallBtn: {
    padding: '8px 16px',
    fontSize: '13px',
  },
  addFieldForm: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
  },
  fieldsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldItem: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  fieldMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    '& h3': {
      color: 'var(--text-primary)',
    },
    '& p': {
      color: 'var(--text-secondary)',
      fontSize: '13px',
    }
  },
  riskBadgeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
  },
  riskBadge: {
    display: 'inline-block',
    width: 'max-content',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700',
    border: '1px solid',
  },
  recommendationText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  triggerBtn: {
    padding: '10px 18px',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px',
  },
  reviewItem: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  reviewMeta: {
    fontSize: '13px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  highlightText: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  verifyActions: {
    display: 'flex',
    gap: '8px',
  },
  verifyActionBtn: {
    padding: '6px 12px',
    fontSize: '12px',
  },
  sectionSub: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '16px',
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    textAlign: 'left',
    color: 'var(--text-secondary)',
    '& th': {
      padding: '12px',
      borderBottom: '1px solid var(--border-glass)',
      color: 'var(--text-secondary)',
      fontWeight: '600',
    },
    '& td': {
      padding: '12px',
      borderBottom: '1px solid var(--border-glass)',
    }
  },
  emptyText: {
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
    padding: '16px',
  },
  emptyTable: {
    textAlign: 'center',
    color: '#64748b',
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
  }
};

export default Dashboard;
