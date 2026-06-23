// import React, { useState } from 'react';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import UploadDisease from './pages/UploadDisease';
// import About from './pages/About';
// import DiseaseGuide from './pages/DiseaseGuide';
// import ProfileSettings from './pages/ProfileSettings';
// import Contact from './pages/Contact';
// import { Sprout, LogOut, LayoutDashboard, Upload, Info, BookOpen, User, Mail, Sparkles, X, Send } from 'lucide-react';
// import { useTranslation } from './context/TranslationContext';

// const MainAppContent = () => {
//   const { user, logout } = useAuth();
//   const { lang, setLang, t } = useTranslation();
//   const [currentView, setCurrentView] = useState('dashboard');
//   const [showLogin, setShowLogin] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatMessages, setChatMessages] = useState([
//     { sender: 'bot', text: 'Hello! I am the AgriPulse AI Copilot assistant. Ask me questions about leaf diseases (rust, blight, mildew, leaf spot), telemetry sensors, or our outbreak warning algorithms!' }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');

//   const handleSend = async () => {
//     if (!inputMessage.trim()) return;
//     const userText = inputMessage;
//     setInputMessage('');
//     setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);

//     try {
//       const res = await fetch('/api/assistant/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: userText }),
//       });
//       if (!res.ok) throw new Error('Failed to connect to assistant');
//       const data = await res.json();
//       setChatMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
//     } catch (err) {
//       setChatMessages((prev) => [...prev, { sender: 'bot', text: 'Error: Could not reach AI Copilot. Please check backend connection.' }]);
//     }
//   };

//   React.useEffect(() => {
//     const el = document.getElementById('chat-history-container');
//     if (el) {
//       el.scrollTop = el.scrollHeight;
//     }
//   }, [chatMessages, chatOpen]);

//   const renderFloatingAssistant = () => {
//     return (
//       <div className="ai-chat-widget">
//         {!chatOpen ? (
//           <button 
//             type="button" 
//             className="ai-chat-trigger" 
//             onClick={() => setChatOpen(true)}
//             title="Ask AgriPulse Assistant"
//           >
//             <Sparkles size={24} />
//           </button>
//         ) : (
//           <div className="ai-chat-panel">
//             <div className="ai-chat-header">
//               <Sparkles size={18} color="#10b981" />
//               <h3 style={{ flex: 1, color: '#ffffff', margin: 0 }}>AgriPulse AI Copilot</h3>
//               <button 
//                 type="button" 
//                 onClick={() => setChatOpen(false)}
//                 style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="ai-chat-history" id="chat-history-container">
//               {chatMessages.map((msg, idx) => (
//                 <div 
//                   key={idx} 
//                   className={`ai-msg ${msg.sender === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}
//                   style={{ whiteSpace: 'pre-wrap' }}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//             </div>

//             <form 
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSend();
//               }} 
//               className="ai-chat-input-wrapper"
//             >
//               <input
//                 type="text"
//                 className="ai-chat-input"
//                 placeholder="Ask about blight, rust, telemetry..."
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//               />
//               <button type="submit" className="ai-chat-send">
//                 <Send size={16} />
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (!user) {
//     if (showLogin) {
//       return <Login onBackToLanding={() => setShowLogin(false)} />;
//     }

//     return (
//       <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//         {/* LANDING NAV */}
//         <header className="landing-nav">
//           <div className="landing-nav-logo">
//             <Sprout size={28} color="#10b981" />
//             <span>AgriPulse</span>
//           </div>
//           <div className="landing-nav-links">
//             <a href="#home" className="landing-nav-link">{t('nav_home')}</a>
//             <a href="#about" className="landing-nav-link">{t('nav_about')}</a>
//             <a href="#services" className="landing-nav-link">{t('nav_services')}</a>
//             <a href="#impact" className="landing-nav-link">{t('nav_impact')}</a>
//             <a href="#contact" className="landing-nav-link">{t('nav_contact')}</a>
//           </div>
//           <div className="landing-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <select 
//               value={lang} 
//               onChange={(e) => setLang(e.target.value)} 
//               className="lang-select"
//             >
//               <option value="en">English</option>
//               <option value="hi">हिन्दी</option>
//               <option value="other">Other</option>
//             </select>
//             <button className="landing-nav-link btn-landing-login" onClick={() => setShowLogin(true)}>
//               {t('btn_login')}
//             </button>
//             <button className="btn-landing-getstarted" onClick={() => setShowLogin(true)}>
//               {t('btn_get_started')} <Sprout size={16} />
//             </button>
//           </div>
//         </header>

//         {/* HERO */}
//         <section id="home" className="landing-hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80')`}}>
//           <div className="landing-hero-content">
//             <h1 className="landing-hero-title">{t('hero_title')}</h1>
//             <p className="landing-hero-subtitle">{t('hero_subtitle')}</p>
//           </div>
//         </section>

//         {/* ABOUT */}
//         <section id="about" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9' }}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
//             <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
//               <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('sec_overview')}</span>
//               <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>{t('sec_about_title')}</h2>
//               <p style={{ color: '#64748b', fontSize: '16px', marginTop: '16px', lineHeight: '1.6' }}>{t('sec_about_desc')}</p>
//             </div>
            
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
//               <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
//                 <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{t('card_cnn_title')}</h3>
//                 <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{t('card_cnn_desc')}</p>
//               </div>
              
//               <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
//                 <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{t('card_iot_title')}</h3>
//                 <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{t('card_iot_desc')}</p>
//               </div>

//               <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
//                 <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{t('card_fusion_title')}</h3>
//                 <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{t('card_fusion_desc')}</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* SERVICES */}
//         <section id="services" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
//             <div>
//               <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('sec_services_sub')}</span>
//               <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a', lineHeight: '1.2' }}>{t('sec_services_title')}</h2>
//               <p style={{ color: '#64748b', fontSize: '16px', marginTop: '16px', lineHeight: '1.6' }}>{t('sec_services_desc')}</p>
//               <ul style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
//                 <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
//                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_1')}
//                 </li>
//                 <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
//                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_2')}
//                 </li>
//                 <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
//                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_3')}
//                 </li>
//                 <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
//                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_4')}
//                 </li>
//               </ul>
//             </div>
            
//             <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
//               <img 
//                 src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80" 
//                 alt="Agriculture IoT" 
//                 style={{ width: '100%', height: '360px', objectFit: 'cover' }} 
//               />
//             </div>
//           </div>
//         </section>

//         {/* IMPACT */}
//         <section id="impact" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9' }}>
//           <div style={{ textAlign: 'center', marginBottom: '40px' }}>
//             <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('sec_impact_sub')}</span>
//             <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>{t('sec_impact_title')}</h2>
//           </div>
          
//           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '30px', textAlign: 'center' }}>
//             <div style={{ flex: '1 1 200px' }}>
//               <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>40%</div>
//               <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_yield')}</div>
//             </div>
//             <div style={{ flex: '1 1 200px' }}>
//               <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>12+ Hrs</div>
//               <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_lead')}</div>
//             </div>
//             <div style={{ flex: '1 1 200px' }}>
//               <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>96%</div>
//               <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_cnn')}</div>
//             </div>
//             <div style={{ flex: '1 1 200px' }}>
//               <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>250+</div>
//               <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_nodes')}</div>
//             </div>
//           </div>
//         </section>

//         {/* CONTACT */}
//         <section id="contact" className="landing-section" style={{ paddingBottom: '120px' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
//             <div>
//               <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('sec_contact_sub')}</span>
//               <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>{t('sec_contact_title')}</h2>
//               <p style={{ color: '#64748b', fontSize: '16px', marginTop: '16px', lineHeight: '1.6' }}>{t('sec_contact_desc')}</p>
//               <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <span style={{ fontSize: '20px' }}>📍</span>
//                   <span style={{ color: '#334155', fontSize: '14px' }}>Innovation Agronomy Park, Pune, MH, India</span>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <span style={{ fontSize: '20px' }}>📧</span>
//                   <span style={{ color: '#334155', fontSize: '14px' }}>contact@agripulse.com</span>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <span style={{ fontSize: '20px' }}>📞</span>
//                   <span style={{ color: '#334155', fontSize: '14px' }}>+91-1800-AGRI-PULSE (Toll-Free)</span>
//                 </div>
//               </div>
//             </div>
            
//             <div style={{ padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
//               <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Send a Message</h3>
//               <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent successfully."); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                 <div>
//                   <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{t('lbl_name')}</label>
//                   <input type="text" className="input-control" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }} required />
//                 </div>
//                 <div>
//                   <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{t('lbl_email')}</label>
//                   <input type="email" className="input-control" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }} required />
//                 </div>
//                 <div>
//                   <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{t('lbl_message')}</label>
//                   <textarea rows="4" className="input-control" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', resize: 'none' }} required></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#224b2a', color: '#ffffff' }}>{t('btn_send_msg')}</button>
//               </form>
//             </div>
//           </div>
//         </section>

//         {/* FOOTER */}
//         <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 20px', textAlign: 'center', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
//           <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: '700' }}>
//               <Sprout size={20} color="#10b981" /> AgriPulse
//             </div>
//             <div>
//               {t('footer_text')}
//             </div>
//             <div style={{ display: 'flex', gap: '16px' }}>
//               <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav_about')}</a>
//               <a href="#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav_services')}</a>
//               <a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav_contact')}</a>
//             </div>
//           </div>
//         </footer>

//         {renderFloatingAssistant()}
//       </div>
//     );
//   }

//   const renderView = () => {
//     switch (currentView) {
//       case 'dashboard':
//         return <Dashboard />;
//       case 'upload':
//         return <UploadDisease />;
//       case 'about':
//         return <About />;
//       case 'guide':
//         return <DiseaseGuide />;
//       case 'profile':
//         return <ProfileSettings />;
//       case 'contact':
//         return <Contact />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div style={styles.appContainer}>
//       {/* NAVBAR */}
//       <nav style={styles.nav} className="glass-panel">
//         <div style={styles.navLogo}>
//           <Sprout size={24} color="#10b981" />
//           <span style={styles.logoText}>AgriPulse</span>
//         </div>
        
//         <div style={styles.navLinks}>
//           <button 
//             onClick={() => setCurrentView('dashboard')}
//             style={{
//               ...styles.navLink,
//               color: currentView === 'dashboard' ? '#10b981' : 'var(--text-secondary)',
//               backgroundColor: currentView === 'dashboard' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
//               borderColor: currentView === 'dashboard' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
//             }}
//           >
//             <LayoutDashboard size={18} /> {t('nav_dashboard')}
//           </button>
          
//           <button 
//             onClick={() => setCurrentView('upload')}
//             style={{
//               ...styles.navLink,
//               color: currentView === 'upload' ? '#10b981' : 'var(--text-secondary)',
//               backgroundColor: currentView === 'upload' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
//               borderColor: currentView === 'upload' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
//             }}
//           >
//             <Upload size={18} /> {t('nav_analysis')}
//           </button>

//           <button 
//             onClick={() => setCurrentView('guide')}
//             style={{
//               ...styles.navLink,
//               color: currentView === 'guide' ? '#10b981' : 'var(--text-secondary)',
//               backgroundColor: currentView === 'guide' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
//               borderColor: currentView === 'guide' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
//             }}
//           >
//             <BookOpen size={18} /> {t('nav_guide')}
//           </button>

//           <button 
//             onClick={() => setCurrentView('about')}
//             style={{
//               ...styles.navLink,
//               color: currentView === 'about' ? '#10b981' : 'var(--text-secondary)',
//               backgroundColor: currentView === 'about' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
//               borderColor: currentView === 'about' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
//             }}
//           >
//             <Info size={18} /> {t('nav_about')}
//           </button>

//           <button 
//             onClick={() => setCurrentView('profile')}
//             style={{
//               ...styles.navLink,
//               color: currentView === 'profile' ? '#10b981' : 'var(--text-secondary)',
//               backgroundColor: currentView === 'profile' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
//               borderColor: currentView === 'profile' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
//             }}
//           >
//             <User size={18} /> {t('nav_settings')}
//           </button>

//           <button 
//             onClick={() => setCurrentView('contact')}
//             style={{
//               ...styles.navLink,
//               color: currentView === 'contact' ? '#10b981' : 'var(--text-secondary)',
//               backgroundColor: currentView === 'contact' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
//               borderColor: currentView === 'contact' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
//             }}
//           >
//             <Mail size={18} /> {t('nav_support')}
//           </button>
//         </div>

//         <div style={styles.navProfile}>
//           <div style={styles.userInfo}>
//             <span style={styles.username}>{user.username}</span>
//             <span style={styles.role}>{user.role}</span>
//           </div>
//           <button onClick={logout} style={styles.logoutBtn} title="Sign Out">
//             <LogOut size={18} />
//           </button>
//         </div>
//       </nav>

//       {/* VIEW PANEL */}
//       <main style={styles.main}>
//         {renderView()}
//       </main>

//       {/* FOOTER */}
//       <footer style={styles.footer} className="glass-panel">
//         <div>
//           <span>© 2026 AgriPulse. Precision Agriculture AI Network.</span>
//         </div>
//         <div style={styles.footerRight}>
//           <span style={styles.statusDot}></span>
//           <span>IoT Gateway: Active</span>
//         </div>
//       </footer>

//       {renderFloatingAssistant()}
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <AuthProvider>
//       <MainAppContent />
//     </AuthProvider>
//   );
// };

// const styles = {
//   appContainer: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '20px',
//   },
//   nav: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '12px 24px',
//     borderRadius: '12px',
//     marginBottom: '20px',
//   },
//   navLogo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//   },
//   logoText: {
//     fontFamily: 'Outfit, sans-serif',
//     fontSize: '20px',
//     fontWeight: '800',
//     color: 'var(--text-primary)',
//     letterSpacing: '-0.02em',
//   },
//   navLinks: {
//     display: 'flex',
//     gap: '12px',
//   },
//   navLink: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '8px 16px',
//     borderRadius: '8px',
//     border: '1px solid transparent',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//   },
//   navProfile: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//   },
//   userInfo: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//   },
//   username: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: 'var(--text-primary)',
//   },
//   role: {
//     fontSize: '11px',
//     color: '#10b981',
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },
//   logoutBtn: {
//     background: '#f1f5f9',
//     border: '1px solid #cbd5e1',
//     padding: '8px',
//     borderRadius: '8px',
//     color: '#ef4444',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'all 0.2s ease',
//   },
//   main: {
//     minHeight: '75vh',
//     marginBottom: '40px',
//   },
//   footer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '16px 24px',
//     borderRadius: '12px',
//     fontSize: '12px',
//     color: 'var(--text-secondary)',
//     marginTop: '40px',
//     marginBottom: '20px',
//   },
//   footerRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//   },
//   statusDot: {
//     display: 'inline-block',
//     width: '8px',
//     height: '8px',
//     borderRadius: '50%',
//     backgroundColor: '#10b981',
//     boxShadow: '0 0 8px #10b981',
//   }
// };

// export default App;




import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadDisease from './pages/UploadDisease';
import About from './pages/About';
import DiseaseGuide from './pages/DiseaseGuide';
import ProfileSettings from './pages/ProfileSettings';
import Contact from './pages/Contact';
import { Sprout, LogOut, LayoutDashboard, Upload, Info, BookOpen, User, Mail, Sparkles, X, Send } from 'lucide-react';
import { useTranslation } from './context/TranslationContext';

const MainAppContent = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useTranslation();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am the AgriPulse AI Copilot assistant. Ask me questions about leaf diseases (rust, blight, mildew, leaf spot), telemetry sensors, or our outbreak warning algorithms!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage;
    setInputMessage('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      if (!res.ok) throw new Error('Failed to connect to assistant');
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: 'bot', text: 'Error: Could not reach AI Copilot. Please check backend connection.' }]);
    }
  };

  React.useEffect(() => {
    const el = document.getElementById('chat-history-container');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatMessages, chatOpen]);

  const renderFloatingAssistant = () => {
    return (
      <div className="ai-chat-widget">
        {!chatOpen ? (
          <button 
            type="button" 
            className="ai-chat-trigger" 
            onClick={() => setChatOpen(true)}
            title="Ask AgriPulse Assistant"
          >
            <Sparkles size={24} />
          </button>
        ) : (
          <div className="ai-chat-panel">
            <div className="ai-chat-header">
              <Sparkles size={18} color="#224b2a" />
              <h3 style={{ flex: 1, color: '#ffffff', margin: 0 }}>AgriPulse AI Copilot</h3>
              <button 
                type="button" 
                onClick={() => setChatOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ai-chat-history" id="chat-history-container">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`ai-msg ${msg.sender === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }} 
              className="ai-chat-input-wrapper"
            >
              <input
                type="text"
                className="ai-chat-input"
                placeholder="Ask about blight, rust, telemetry..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit" className="ai-chat-send">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    if (showLogin) {
      return <Login onBackToLanding={() => setShowLogin(false)} />;
    }

    return (
      <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* LANDING NAV */}
        <header className="landing-nav">
          <div className="landing-nav-logo">
            <Sprout size={28} color="#224b2a" />
            <span>AgriPulse</span>
          </div>
          <div className="landing-nav-links">
            <a href="#home" className="landing-nav-link">{t('nav_home')}</a>
            <a href="#about" className="landing-nav-link">{t('nav_about')}</a>
            <a href="#services" className="landing-nav-link">{t('nav_services')}</a>
            <a href="#impact" className="landing-nav-link">{t('nav_impact')}</a>
            <a href="#contact" className="landing-nav-link">{t('nav_contact')}</a>
          </div>
          <div className="landing-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)} 
              className="lang-select"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            <button className="landing-nav-link btn-landing-login" onClick={() => setShowLogin(true)}>
              {t('btn_login')}
            </button>
            <button className="btn-landing-getstarted" onClick={() => setShowLogin(true)}>
              {t('btn_get_started')} <Sprout size={16} />
            </button>
          </div>
        </header>

        {/* HERO */}
        <section id="home" className="landing-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2200&q=85)`}}>
          <div className="landing-hero-content">
            <h1 className="landing-hero-title">{t('hero_title')}</h1>
            <p className="landing-hero-subtitle">{t('hero_subtitle')}</p>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('sec_overview')}</span>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>{t('sec_about_title')}</h2>
              <p style={{ color: '#64748b', fontSize: '16px', marginTop: '16px', lineHeight: '1.6' }}>{t('sec_about_desc')}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{t('card_cnn_title')}</h3>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{t('card_cnn_desc')}</p>
              </div>
              
              <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{t('card_iot_title')}</h3>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{t('card_iot_desc')}</p>
              </div>

              <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{t('card_fusion_title')}</h3>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{t('card_fusion_desc')}</p>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9' ,padding:'0'}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', }}></div>
            <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '1px', color: '#0f172a',padding:'0'}}>Who we are</h2>
              <p style={{ color: '#353b44', fontSize: '18px', marginTop: '16px', lineHeight: '1.6' }}>Welcome to Smart Agriculture Assistant, a platform dedicated to empowering farmers with modern technology and intelligent solutions.
We are a team passionate about improving agriculture through innovation. Our mission is to help farmers make informed decisions, increase crop productivity, reduce losses, and promote sustainable farming practices.
By combining Artificial Intelligence (AI), weather forecasting, crop management tools, and real-time agricultural insights, we provide farmers with easy-to-use digital assistance for their daily farming needs</p>
              <img 
                src="https://agssbd.org/wp-content/uploads/2021/02/Smart-farming-LetsNurture.jpg"
                style={{marginTop: '16px', width: '100%', height: '360px', objectFit: 'cover' }} 
              />
            </div>
          </section>
        <section id="about" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9',padding:'10' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}></div>
            <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '1px', color: '#0f172a',padding:'10'}}>How to Work</h2>
              <p style={{ color: '#353b44', fontSize: '18px', marginTop: '16px', lineHeight: '1.6' }}>At Smart Agriculture Assistant, we simplify farming by combining technology, data, and artificial intelligence to provide farmers with practical solutions for everyday agricultural challenges.
Our process begins when farmers enter information about their crops, soil conditions, farm location, or upload images of affected plants. The platform then analyzes this data using advanced AI models, agricultural knowledge databases, and real-time weather information.
Based on the analysis, the system generates personalized recommendations such as suitable crops, irrigation schedules, fertilizer usage, disease identification, pest control measures, and weather-based farming advice. Farmers can also access real-time market prices to make better selling decisions and maximize profits.
The platform continuously monitors weather conditions and agricultural trends to provide timely alerts and updates. Additionally, our AI-powered assistant is available to answer farming-related questions and offer guidance whenever needed.
By transforming complex agricultural data into simple, actionable insights, Smart Agriculture Assistant helps farmers increase productivity, reduce losses, save resources, and adopt more sustainable farming practices.</p>
              <p style={{ color: '#353b44', fontSize: '18px', marginTop: '16px', lineHeight: '1.6' }}> Collect Data → Analyze with AI → Generate Recommendations → Monitor Conditions → Support Better Farming Decisions</p>
              <img 
                src="https://www.symmetryelectronics.com/getmedia/5ddf849b-de2f-42f5-99c6-24ee59a98b22/iStock-1429073633.jpg"
                style={{marginTop: '16px', width: '100%', height: '360px', objectFit: 'cover' }} 
              />
            </div>
          </section>

        {/* SERVICES */}
         <section id="about" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9',padding:'0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' ,padding:'0'}}>
              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('WHAT WE OFFER')}</span>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>{t('Advanced Services for Smarter Yields')}</h2>
              <p style={{ color: '#353B44', fontSize: '16px', marginTop: '16px', lineHeight: '1.6' }}>{t('AgriPulse equips modern agricultural cooperatives with the digital tools required to transition from reactive chemical sprays to proactive pest management.')}</p>
            </div>
          </div>
        </section>
        <section id="services" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9' ,padding:'0'}}>
          <div style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <ul style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_1')}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_2')}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_3')}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('srv_4')}
                </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('🌱 AI Plant Disease DetectionUpload a crop image to instantly identify plant diseases and receive treatment recommendations.')}
                </li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('🌦️ Weather Forecast & Alerts Get real-time weather updates, rainfall predictions, temperature, humidity, and farming alerts to plan agricultural activities.')}
                </li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('🌾 Smart Crop Recommendations Receive personalized crop suggestions based on soil type, weather conditions, and seasonal data.')}
                </li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('🤖 AI-Powered Farming Insights Receive intelligent recommendations to improve crop health, increase yield, and reduce farming risks.')}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {t('📊 Farmer Dashboard Access all your farming information, predictions, recommendations, and crop history from a single, easy-to-use Dashboard.')}
                </li>
              </ul>
            </div>
            
            <div style={{position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <img 
                src="https://thumbs.dreamstime.com/b/combine-harvester-harvesting-wheat-farmer-holding-fresh-vegetables-field-to-table-photo-collage-showcasing-agricultural-396922698.jpg"
                style={{ width: '100%', height: '360px', objectFit: 'cover' }} 
              />
            </div>
          </div>
        </section>

        {/* IMPACT */}
          
        <section id="impact" className="landing-section" style={{ borderBottom: '1px solid #f1f5f9' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('Real-World Impact')}</span>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '1px', color: '#0f172a' }}>{t('Impact')}</h2>
              <p style={{ color: '#353b44', fontSize: '18px', marginTop: '16px', lineHeight: '1.6' }}>{t('AgriPulse empowers farmers by providing smart, technology-driven agricultural solutions that improve productivity, sustainability, and profitability. Through AI-powered insights, real-time data, and digital farming tools, AgriPulse helps farmers make informed decisions and overcome everyday agricultural challenges.')}</p> 
            </div>
            </div>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>{t('sec_impact_title')}</h2>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '30px', textAlign: 'center' }}>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>40%</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_yield')}</div>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>12+ Hrs</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_lead')}</div>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>96%</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_cnn')}</div>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#224b2a' }}>250+</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>{t('stat_nodes')}</div>
            </div>
            <p style={{ color: '#353b44', fontSize: '18px', marginTop: '16px', lineHeight: '1.6' }}>{t('AgriPulse is transforming agriculture by helping farmers farm smarter, reduce risks, increase profitability, and build a more sustainable future.')}</p> 
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="landing-section" style={{ paddingBottom: '120px',padding:'0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
            <div>
              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('sec_contact_sub')}</span>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>{t('sec_contact_title')}</h2>
              <p style={{ color: '#64748b', fontSize: '16px', marginTop: '16px', lineHeight: '1.6' }}>{t('sec_contact_desc')}</p>
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📍</span>
                  <span style={{ color: '#334155', fontSize: '14px' }}>Innovation Agronomy Park, Pune, MH, India</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📧</span>
                  <span style={{ color: '#334155', fontSize: '14px' }}>contact@agripulse.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📞</span>
                  <span style={{ color: '#334155', fontSize: '14px' }}>+91-1800-AGRI-PULSE (Toll-Free)</span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Send a Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent successfully."); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{t('lbl_name')}</label>
                  <input type="text" className="input-control" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{t('lbl_email')}</label>
                  <input type="email" className="input-control" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>{t('lbl_message')}</label>
                  <textarea rows="4" className="input-control" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', resize: 'none' }} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#224b2a', color: '#ffffff' }}>{t('btn_send_msg')}</button>
              </form>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 20px', textAlign: 'center', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: '700' }}>
              <Sprout size={20} color="#10b981" /> AgriPulse
            </div>
            <div>
              {t('footer_text')}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav_about')}</a>
              <a href="#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav_services')}</a>
              <a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav_contact')}</a>
            </div>
          </div>
        </footer>

        {renderFloatingAssistant()}
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <UploadDisease />;
      case 'about':
        return <About />;
      case 'guide':
        return <DiseaseGuide />;
      case 'profile':
        return <ProfileSettings />;
      case 'contact':
        return <Contact />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* NAVBAR */}
      <nav style={styles.nav} className="glass-panel">
        <div style={styles.navLogo}>
          <Sprout size={24} color="#10b981" />
          <span style={styles.logoText}>AgriPulse</span>
        </div>
        
        <div style={styles.navLinks}>
          <button 
            onClick={() => setCurrentView('dashboard')}
            style={{
              ...styles.navLink,
              color: currentView === 'dashboard' ? '#10b981' : '#cbd5e1',
              backgroundColor: currentView === 'dashboard' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              borderColor: currentView === 'dashboard' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          
          <button 
            onClick={() => setCurrentView('upload')}
            style={{
              ...styles.navLink,
              color: currentView === 'upload' ? '#10b981' : '#cbd5e1',
              backgroundColor: currentView === 'upload' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              borderColor: currentView === 'upload' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            <Upload size={18} /> Leaf Analysis
          </button>

          <button 
            onClick={() => setCurrentView('guide')}
            style={{
              ...styles.navLink,
              color: currentView === 'guide' ? '#10b981' : '#cbd5e1',
              backgroundColor: currentView === 'guide' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              borderColor: currentView === 'guide' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            <BookOpen size={18} /> Disease Guide
          </button>

          <button 
            onClick={() => setCurrentView('about')}
            style={{
              ...styles.navLink,
              color: currentView === 'about' ? '#10b981' : '#cbd5e1',
              backgroundColor: currentView === 'about' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              borderColor: currentView === 'about' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            <Info size={18} /> About
          </button>

          <button 
            onClick={() => setCurrentView('profile')}
            style={{
              ...styles.navLink,
              color: currentView === 'profile' ? '#10b981' : '#cbd5e1',
              backgroundColor: currentView === 'profile' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              borderColor: currentView === 'profile' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            <User size={18} /> Settings
          </button>

          <button 
            onClick={() => setCurrentView('contact')}
            style={{
              ...styles.navLink,
              color: currentView === 'contact' ? '#10b981' : '#cbd5e1',
              backgroundColor: currentView === 'contact' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              borderColor: currentView === 'contact' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            <Mail size={18} /> Support
          </button>
        </div>

        <div style={styles.navProfile}>
          <div style={styles.userInfo}>
            <span style={styles.username}>{user.username}</span>
            <span style={styles.role}>{user.role}</span>
          </div>
          <button onClick={logout} style={styles.logoutBtn} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* VIEW PANEL */}
      <main style={styles.main}>
        {renderView()}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer} className="glass-panel">
        <div>
          <span>© 2026 AgriPulse. Precision Agriculture AI Network.</span>
        </div>
        <div style={styles.footerRight}>
          <span style={styles.statusDot}></span>
          <span>IoT Gateway: Active</span>
        </div>
      </footer>

      {renderFloatingAssistant()}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

const styles = {
  appContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: '12px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid transparent',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  navProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  username: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  role: {
    fontSize: '11px',
    color: '#10b981',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '8px',
    borderRadius: '8px',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  main: {
    minHeight: '75vh',
    marginBottom: '40px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#64748b',
    marginTop: '40px',
    marginBottom: '20px',
  },
  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981',
  }
};

export default App;
