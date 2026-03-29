import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sandun Siwantha</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '300px' }}>
            Transforming innovative ideas into robust hardware and intelligent software solutions.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://github.com/Sandun-S" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/sandun-siwantha/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}><Linkedin size={20} /></a>
            <a href="mailto:contact@sandunsiwantha.com" style={{ color: 'var(--text-secondary)' }}><Mail size={20} /></a>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Me</Link></li>
            <li><Link to="/services" style={{ color: 'var(--text-secondary)' }}>Services</Link></li>
            <li><Link to="/case-studies" style={{ color: 'var(--text-secondary)' }}>Case Studies</Link></li>
            <li><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container" style={{ textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        &copy; {currentYear} Sandun Siwantha. All rights reserved.
      </div>
    </footer>
  );
}
