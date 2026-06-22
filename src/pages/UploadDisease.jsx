import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

const UploadDisease = () => {
  const { authenticatedFetch } = useAuth();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch fields and upload history
  const fetchData = async () => {
    try {
      const fieldsRes = await authenticatedFetch('/api/predictions/fields');
      if (fieldsRes.ok) {
        const fieldsJson = await fieldsRes.json();
        setFields(fieldsJson);
        if (fieldsJson.length > 0) {
          setSelectedField(fieldsJson[0].id.toString());
        }
      }

      const historyRes = await authenticatedFetch('/api/classification/history');
      if (historyRes.ok) {
        const historyJson = await historyRes.json();
        setHistory(historyJson);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedField) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('field_id', selectedField);
    formData.append('file', file);

    try {
      const res = await authenticatedFetch('/api/classification/classify', {
        method: 'POST',
        body: formData, // Do NOT set content-type header; fetch sets it automatically with boundary for multipart/form-data
      });

      if (!res.ok) {
        throw new Error('Classification failed');
      }

      const json = await res.json();
      setResult(json);
      setFile(null);
      // Reload history
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Crop leaf Disease Classification</h1>
      <p style={styles.subtitle}>Upload photos of crop leaves to analyze health status instantly using our PyTorch CNN pipeline</p>

      <div style={styles.grid}>
        {/* UPLOADER */}
        <div className="glass-panel" style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Affected Crop Field</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="input-control"
              >
                {fields.length === 0 ? (
                  <option value="">No fields available - please create one first</option>
                ) : (
                  fields.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.crop_type})</option>
                  ))
                )}
              </select>
            </div>

            {/* DROPZONE */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                ...styles.dropZone,
                borderColor: dragging ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: dragging ? 'rgba(16, 185, 129, 0.03)' : 'rgba(15, 23, 42, 0.4)'
              }}
            >
              <UploadCloud size={48} color={dragging ? '#10b981' : '#64748b'} style={styles.icon} />
              <p style={styles.dropText}>
                Drag and drop your leaf photo here, or <label style={styles.browseLabel}>browse<input type="file" onChange={handleFileChange} style={styles.hiddenInput} accept="image/*" /></label>
              </p>
              {file && <div style={styles.selectedFile}>Selected: <strong>{file.name}</strong></div>}
            </div>

            <button type="submit" disabled={loading || !file} className="btn btn-primary" style={styles.uploadBtn}>
              {loading ? <RefreshCw className="spin" size={16} /> : null}
              {loading ? 'Processing Image...' : 'Analyze Health'}
            </button>
          </form>

          {/* INFERENCE RESULTS */}
          {result && (
            <div style={styles.resultContainer} className="glass-panel">
              <div style={styles.resultHeader}>
                {(result.disease_detected || '').toLowerCase().includes('healthy') ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <AlertTriangle size={24} color="#f59e0b" />
                )}
                <h3>Analysis Results</h3>
              </div>
              <div style={styles.resultBody}>
                <p>Status: <strong style={{color: (result.disease_detected || '').toLowerCase().includes('healthy') ? '#10b981' : '#f59e0b'}}>{result.disease_detected || 'Unknown'}</strong></p>
                <p>ML Confidence Rate: <strong>{Math.round((result.confidence || 0) * 100)}%</strong></p>
                <p>Classification Log ID: <code>#{result.id}</code></p>
                <div style={styles.adviceCard}>
                  <strong>Action Recommended:</strong>
                  <p>{(result.disease_detected || '').toLowerCase().includes('healthy') 
                    ? 'No pathogen traces detected. Continue normal crop management parameters.' 
                    : 'Disease confirmed. Notify agronomist immediately and isolate crop area.'
                  }</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LOG HISTORY */}
        <div className="glass-panel" style={styles.card}>
          <h2>Leaves Scan History</h2>
          <p style={styles.sectionSub}>Previous diagnosis logs uploaded across your crop plots</p>
          
          <div style={styles.historyList}>
            {history.length === 0 ? (
              <p style={styles.emptyText}>No diagnostic logs uploaded yet.</p>
            ) : (
              history.map((h) => (
                <div key={h.id} style={styles.historyItem}>
                  <div style={styles.historyMeta}>
                    <p style={styles.historyTitle}>{h.filename}</p>
                    <p style={styles.historyDate}>{new Date(h.uploaded_at).toLocaleString()}</p>
                  </div>
                  <div style={styles.historyResult}>
                    <span style={{
                      ...styles.resultTag,
                      backgroundColor: (h.disease_detected || '').toLowerCase().includes('healthy') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      borderColor: (h.disease_detected || '').toLowerCase().includes('healthy') ? '#10b981' : '#f59e0b',
                      color: (h.disease_detected || '').toLowerCase().includes('healthy') ? '#a7f3d0' : '#fcd34d'
                    }}>
                      {h.disease_detected || 'Unknown'}
                    </span>
                    <span style={styles.historyStatus}>{h.status}</span>
                  </div>
                </div>
              ))
            )}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    padding: '30px',
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
  dropZone: {
    border: '2px dashed rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  icon: {
    marginBottom: '16px',
  },
  dropText: {
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
  },
  browseLabel: {
    color: '#10b981',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  hiddenInput: {
    display: 'none',
  },
  selectedFile: {
    marginTop: '16px',
    fontSize: '13px',
    color: '#e2e8f0',
  },
  uploadBtn: {
    width: '100%',
  },
  resultContainer: {
    marginTop: '24px',
    padding: '20px',
    border: '1px solid rgba(16, 185, 129, 0.15)',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    '& h3': {
      fontSize: '18px',
      color: '#fff',
    }
  },
  resultBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#cbd5e1',
  },
  adviceCard: {
    background: 'rgba(255,255,255,0.02)',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    marginTop: '8px',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionSub: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '20px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  historyMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  historyTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  historyDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  historyResult: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  resultTag: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid',
    fontWeight: '600',
  },
  historyStatus: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    padding: '24px 0',
    fontSize: '14px',
  }
};

export default UploadDisease;
