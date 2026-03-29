import React from 'react';
import { Briefcase, GraduationCap, Award, ExternalLink, Download } from 'lucide-react';

export default function About() {
  const experiences = [
    {
      role: "Associate Electronic Engineer",
      company: "RCS2 Technologies",
      period: "Dec 2024 - Present",
      description: "Responsible for end-to-end design of intelligent embedded systems, from hardware and multi-layer PCB layout to firmware development in C/C++ with FreeRTOS and wireless module integration."
    },
    {
      role: "Trainee - Electronic Designer (R&D)",
      company: "RCS2 Technologies",
      period: "May 2024 - Nov 2024",
      description: "Contributed to product-level R&D by integrating embedded AI models (YOLO, audio classification) and developing Python/Flask-based PC tools for device control and testing."
    }
  ];

  const education = [
    {
      degree: "BSc in Physics & Electronics",
      institution: "University of Kelaniya, Sri Lanka",
      period: "2021 - 2024"
    },
    {
      degree: "Diploma in Information Technology",
      institution: "ESOFT Metro Campus",
      period: "2016"
    }
  ];

  const skills = [
    "C/C++", "Python", "JavaScript/React", "FreeRTOS", "ESP-IDF", 
    "Altium Designer", "Eagle PCB", "IoT (MQTT, LoRaWAN)", "Machine Learning (YOLO)"
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Profile Header */}
      <section style={{ position: 'relative', paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="glass" style={{ display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, gap: '2rem', padding: '3rem', borderRadius: 'var(--radius-lg)', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: '#fff', boxShadow: '0 10px 30px rgba(14,165,233,0.3)' }}>
              SS
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Sandun Siwantha</h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', fontWeight: 500, marginBottom: '1rem' }}>Embedded Systems & IoT Engineer</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '800px' }}>
                I specialize in designing and building complete hardware and software solutions that combine real-time processing, wireless communication, and intelligent automation. If you're working on something exciting and need a technically-driven team player, let's connect.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/sandun-siwantha" target="_blank" rel="noreferrer" className="btn btn-primary">
                  LinkedIn Profile <ExternalLink size={18} />
                </a>
                <button className="btn btn-secondary">
                  Download CV <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* Left Column: Experience & Education */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Experience */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                  <Briefcase size={24} />
                </div>
                <h2 style={{ margin: 0 }}>Work Experience</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '2rem' }}>
                {/* Timeline Line */}
                <div style={{ position: 'absolute', left: '0.75rem', top: '1rem', bottom: 0, width: '2px', background: 'var(--glass-border)' }} />
                
                {experiences.map((exp, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-2.4rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', border: '3px solid var(--bg-primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{exp.period}</span>
                    <h3 style={{ fontSize: '1.25rem', margin: '0.25rem 0' }}>{exp.role}</h3>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.5rem' }}>{exp.company}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                  <GraduationCap size={24} />
                </div>
                <h2 style={{ margin: 0 }}>Education</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '2rem' }}>
                {/* Timeline Line */}
                <div style={{ position: 'absolute', left: '0.75rem', top: '1rem', bottom: 0, width: '2px', background: 'var(--glass-border)' }} />
                
                {education.map((edu, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-2.4rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', border: '3px solid var(--bg-primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{edu.period}</span>
                    <h3 style={{ fontSize: '1.25rem', margin: '0.25rem 0' }}>{edu.degree}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Certifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Skills */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Core Technical Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {skills.map(skill => (
                  <span key={skill} style={{ padding: '0.5rem 1rem', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--text-primary)', borderRadius: '9999px', fontSize: '0.9rem', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Certifications (Selected) */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Award size={24} className="text-gradient" />
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Licenses & Certifications</h2>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Project Management Foundations</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>LinkedIn • 2025</p>
                </li>
                <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Machine Learning with Python</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>LinkedIn • 2025</p>
                </li>
                <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>FPGA Embedded System Design</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Arthur C. Clarke Institute • 2024</p>
                </li>
                <li>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>CCNA Security</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cisco Networking Academy • 2019</p>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
