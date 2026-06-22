import React from 'react';
import { Eye, ShieldAlert, HeartPulse } from 'lucide-react';

const DiseaseGuide = () => {
  const diseases = [
    {
      name: "Leaf Rust (Puccinia recondita)",
      crop: "Wheat, Barley, Rye",
      symptoms: "Small, orange-brown pustules forming on leaf surfaces, resembling rust powder.",
      conditions: "Moderate temperatures (15°C–22°C) combined with high relative humidity and dew.",
      treatment: "Apply preventative triazole fungicides, improve canopy spacing, and plant resistant seed varieties."
    },
    {
      name: "Powdery Mildew (Blumeria graminis)",
      crop: "Wheat, Barley, Cucurbits",
      symptoms: "White to light grey powdery patches of fungal spores appearing on leaves and stems.",
      conditions: "Warm, dry days followed by damp, humid nights (Relative Humidity > 70%).",
      treatment: "Use sulfur-based preventative sprays, remove infected crop residues, and optimize ventilation."
    },
    {
      name: "Leaf Spot (Septoria tritici)",
      crop: "Wheat, Grasses, Tomato",
      symptoms: "Irregular light brown spots with dark border pycnidia (black dots) scattered on leaf surfaces.",
      conditions: "Frequent rain splatters and damp leaf wetness periods lasting longer than 15 hours.",
      treatment: "Incorporate crop rotation, optimize nitrogen balance, and apply preventative strobilurin fungicides."
    },
    {
      name: "Late Blight (Phytophthora infestans)",
      crop: "Potato, Tomato",
      symptoms: "Dark green, water-soaked lesions on leaf margins that quickly expand into black rot.",
      conditions: "Persistent cool, wet, humid conditions (Relative Humidity > 90% and Temp 10°C–20°C).",
      treatment: "Apply copper-based organic protectants, clear weed hosts, and destroy infected tubers immediately."
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Crop Pathology Guide</h1>
        <p style={styles.subtitle}>Reference guide for identifying leaf pathogens, growth indicators, and prevention techniques</p>
      </div>

      <div style={styles.grid}>
        {diseases.map((d, index) => (
          <div key={index} className="glass-panel" style={styles.card}>
            <h2 style={styles.diseaseName}>{d.name}</h2>
            <span style={styles.cropTag}>Host Crops: {d.crop}</span>

            <div style={styles.sectionRow}>
              <Eye size={18} color="#94a3b8" style={styles.icon} />
              <div>
                <strong style={styles.sectionTitle}>Visual Symptoms:</strong>
                <p style={styles.sectionText}>{d.symptoms}</p>
              </div>
            </div>

            <div style={styles.sectionRow}>
              <ShieldAlert size={18} color="#f59e0b" style={styles.icon} />
              <div>
                <strong style={styles.sectionTitle}>Outbreak Drivers:</strong>
                <p style={styles.sectionText}>{d.conditions}</p>
              </div>
            </div>

            <div style={styles.sectionRow}>
              <HeartPulse size={18} color="#10b981" style={styles.icon} />
              <div>
                <strong style={styles.sectionTitle}>Prevention Controls:</strong>
                <p style={styles.sectionText}>{d.treatment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 0',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    color: '#fff',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  diseaseName: {
    fontSize: '18px',
    color: '#fff',
    fontWeight: '700',
  },
  cropTag: {
    display: 'inline-block',
    fontSize: '12px',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '4px 10px',
    borderRadius: '4px',
    width: 'max-content',
    fontWeight: '600',
  },
  sectionRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  icon: {
    marginTop: '2px',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: '13px',
    color: '#e2e8f0',
    display: 'block',
    marginBottom: '4px',
  },
  sectionText: {
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: '1.5',
  }
};

export default DiseaseGuide;
