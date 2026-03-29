import React from 'react';
import { Cpu, Wifi, Layers, Code, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      icon: <Cpu size={40} className="text-gradient" />,
      title: "Firmware Development",
      description: "Robust, efficient, and reliable C/C++ firmware for microcontrollers (ESP32, STM32, PIC). I specialize in RTOS implementations, power optimization, and direct hardware interfacing.",
      features: ["FreeRTOS Multi-threading", "Low-power Optimization", "Hardware Abstraction Layers", "OTA Updates"]
    },
    {
      icon: <Layers size={40} className="text-gradient" />,
      title: "Custom PCB Design",
      description: "From schematic capture to multi-layer PCB layout. I ensure signal integrity, EMI/EMC compliance, and manufacturability using industry-standard tools like Altium and Eagle.",
      features: ["Multi-layer Design", "RF & High-Speed layout", "BOM Optimization", "Prototyping & Assembly"]
    },
    {
      icon: <Wifi size={40} className="text-gradient" />,
      title: "IoT Systems Integration",
      description: "Bridging the gap between edge devices and the cloud. I design secure communication pipelines using standard IoT protocols ensuring your data flows reliably.",
      features: ["MQTT / CoAP / HTTP", "LoRaWAN & BLE", "AWS IoT / Firebase API", "Data Security Solutions"]
    },
    {
      icon: <Code size={40} className="text-gradient" />,
      title: "PC Automation Tools",
      description: "Developing cross-platform desktop applications and scripts using Python to interface with hardware for automated testing, flashing, and configuration.",
      features: ["Serial/USB Communication", "Automated Flashing", "Data Logging", "GUI Development (Tkinter/PyQt)"]
    },
    {
      icon: <Zap size={40} className="text-gradient" />,
      title: "Embedded AI & Edge Computing",
      description: "Bringing machine learning to the edge. Integrating lightweight ML models (like YOLO for vision or audio classification) directly onto microcontrollers for real-time inference without cloud dependency.",
      features: ["TinyML integration", "Sensor Fusion", "Real-time Processing", "Edge Optimization"]
    },
    {
      icon: <ShieldCheck size={40} className="text-gradient" />,
      title: "Consulting & Feasibility",
      description: "Not sure where to start? I provide architectural consulting to help you choose the right MCU, wireless protocol, and tech stack for your product's lifecycle.",
      features: ["Component Selection", "Architecture Design", "Cost Estimation", "Risk Assessment"]
    }
  ];

  return (
    <div className="animate-fade-in-up">
      <section className="page-header" style={{ textAlign: 'center', padding: '6rem 0 3rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Services</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Comprehensive hardware and software solutions tailored to bring your physical products into the digital era.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {services.map((srv, idx) => (
              <div key={idx} className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', transition: 'var(--transition-smooth)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                {/* Decorative background circle */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'var(--accent-primary)', opacity: 0.05, filter: 'blur(30px)', borderRadius: '50%' }} />
                
                <div style={{ marginBottom: '1.5rem' }}>{srv.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{srv.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{srv.description}</p>
                
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {srv.features.map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--accent-primary)', borderRadius: '50%' }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Layer */}
      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="glass" style={{ padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'linear-gradient(to right, rgba(14, 165, 233, 0.05), rgba(59, 130, 246, 0.05))' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to build something amazing?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Whether you need a complete ground-up design or help optimizing an existing system, I'm here to push your project forward.
            </p>
            <Link to="/contact" className="btn btn-primary">Start a Conversation</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
