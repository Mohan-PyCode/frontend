import React from 'react';
import { Sprout, Cpu, Activity, Shield } from 'lucide-react';

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.heroSection} className="glass-panel">
        <Sprout size={48} color="#10b981" />
        <h1 style={styles.title}>About AgriPulse</h1>
        <p style={styles.subtitle}>
          An AI-powered ecological early-warning network designed to protect agricultural yields from destructive pathogens and leaf diseases.
        </p>
      </div>

      <div style={styles.grid}>
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <Cpu size={24} color="#10b981" />
            <h2>Computer Vision Diagnostics</h2>
          </div>
          <p style={styles.cardText}>
            AgriPulse uses a deep Convolutional Neural Network (CNN) built in PyTorch to identify leaf pathologies. By analyzing leaf photos uploaded directly from the field, our model detects fungal spores, spot discolouration, and blight traces with high confidence, allowing immediate isolation.
          </p>
        </div>

        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <Activity size={24} color="#f59e0b" />
            <h2>Multi-Sensor Data Fusion</h2>
          </div>
          <p style={styles.cardText}>
            Fungal outbreaks are highly dependent on microclimates. AgriPulse fuses real-time field telemetry logs (temperature, relative humidity, and soil moisture) with regional weather forecasts to calculate an early-warning risk rating, warning farmers *before* visible symptoms germinated.
          </p>
        </div>

        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <Shield size={24} color="#3b82f6" />
            <h2>Collaborative Ecosystem</h2>
          </div>
          <p style={styles.cardText}>
            Our system streamlines communication between Farmers (who log sensors and upload leaf scans), Agronomists (who analyze regional field data and verify AI diagnostic flags), and Administrators (who maintain configuration thresholds and coordinate global system performance).
          </p>
        </div>
      </div>

      <div className="glass-panel" style={styles.infoSection}>
        <h2>Our Mission</h2>
        <p style={styles.infoText}>
          Globally, crop diseases destroy up to 40% of agricultural yields annually, threatening food security and farmer livelihoods. AgriPulse aims to make smart precision agriculture accessible, reducing chemical pesticide dependencies by replacing mass-spraying routines with localized, early-warning preventative crop treatments.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  heroSection: {
    padding: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '32px',
    color: '#fff',
  },
  subtitle: {
    fontSize: '16px',
    color: '#94a3b8',
    maxWidth: '700px',
    lineHeight: '1.6',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '& h2': {
      fontSize: '20px',
      color: '#fff',
    }
  },
  cardText: {
    fontSize: '14px',
    color: '#cbd5e1',
    lineHeight: '1.6',
  },
  infoSection: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    '& h2': {
      color: '#fff',
    }
  },
  infoText: {
    fontSize: '15px',
    color: '#cbd5e1',
    lineHeight: '1.7',
  }
};

export default About;
