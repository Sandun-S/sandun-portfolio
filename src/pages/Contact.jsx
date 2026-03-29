import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real scenario, this would send an email (e.g., EmailJS or Firebase function)
    setStatus('Message sent successfully! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="animate-fade-in-up">
      <section className="page-header" style={{ textAlign: 'center', padding: '6rem 0 3rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Get in Touch</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Have a question or want to work together? Let's connect.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', lg: { gridTemplateColumns: '1fr 1fr' }, gap: '4rem' }}>
          
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Let's talk about your project</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.8 }}>
              I'm open to freelance opportunities, consulting roles, and exciting hardware collaborations. Fill out the form or reach out directly via email.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'var(--glass-bg)', borderRadius: '50%', color: 'var(--accent-primary)', border: '1px solid var(--glass-border)' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Email Me</span>
                  <a href="mailto:contact@sandunsiwantha.com" style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>contact@sandunsiwantha.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'var(--glass-bg)', borderRadius: '50%', color: 'var(--accent-primary)', border: '1px solid var(--glass-border)' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Call Me</span>
                  <a href="tel:+94713735956" style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>+94 71 373 5956</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ padding: '1rem', background: 'var(--glass-bg)', borderRadius: '50%', color: 'var(--accent-primary)', border: '1px solid var(--glass-border)' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Location</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>Colombo, Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {status && (
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
                  {status}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="name" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Your Name</label>
                  <input type="text" id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.3s' }} onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'var(--glass-border)'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="email" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Your Email</label>
                  <input type="email" id="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.3s' }} onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'var(--glass-border)'} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="subject" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Subject</label>
                <input type="text" id="subject" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.3s' }} onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'var(--glass-border)'} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="message" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Message</label>
                <textarea id="message" rows="5" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', transition: 'border-color 0.3s' }} onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'var(--glass-border)'} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                Send Message <Send size={18} />
              </button>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
