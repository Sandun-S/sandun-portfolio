import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Cpu, Lightbulb, Wrench, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch top 3 featured projects
    const qProjects = query(collection(db, 'case_studies'), orderBy('title'), limit(3));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeaturedProjects(projects);
    });

    // Fetch testimonials
    const qTestimonials = query(collection(db, 'testimonials'), orderBy('author'));
    const unsubscribeTestimonials = onSnapshot(qTestimonials, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(tests);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeTestimonials();
    };
  }, []);

  const features = [
    {
      icon: <Cpu size={32} className="text-gradient" />,
      title: "Precision Engineering",
      desc: "Delivering high-quality, reliable solutions by focusing on clean code, robust design, and meticulous attention to detail."
    },
    {
      icon: <Lightbulb size={32} className="text-gradient" />,
      title: "Innovative Solutions",
      desc: "Leveraging modern tools and a deep understanding of core principles to solve complex problems creatively and efficiently."
    },
    {
      icon: <Wrench size={32} className="text-gradient" />,
      title: "End-to-End Expertise",
      desc: "From initial concept and PCB design to firmware development and cloud integration, I offer a complete skillset for your project."
    }
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Solving Complex <br />
            <span className="text-gradient">Engineering Challenges</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            I design and develop robust firmware, custom PCBs, and scalable IoT systems that bring your innovative hardware products to life.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/case-studies" className="btn btn-primary">
              See My Work <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Me
            </Link>
          </div>
        </div>
        {/* Background Decorative Glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--accent-primary)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
      </section>

      {/* Why Work With Me */}
      <section className="section" style={{ background: 'rgba(0,0,0,0.02)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Why Work With Me?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>A dedicated partner for your hardware innovation.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feature, idx) => (
              <div key={idx} className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'left', transition: 'var(--transition-smooth)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to="/services" className="btn btn-secondary">Explore All Services</Link>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Featured Case Studies</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>A glimpse into my problem-solving approach.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {featuredProjects.map(project => (
              <Link key={project.id} to={`/project/${project.id}`} className="glass" style={{ display: 'block', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--glass-border)', transition: 'var(--transition-smooth)' }}>
                <div style={{ width: '100%', height: '200px', background: `url(${project.imageUrl || 'https://placehold.co/600x400/0ea5e9/FFF?text=Project'}) center/cover no-repeat` }} />
                <div style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {Array.isArray(project.category) ? project.category.join(' / ') : project.category}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to="/case-studies" className="btn btn-secondary">View All Case Studies</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'rgba(0,0,0,0.02)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>What My Colleagues Say</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Trust and results, verified by senior engineers and managers.</p>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
            >
              {testimonials.map((test, idx) => (
                <SwiperSlide key={idx}>
                  <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', margin: '1rem' }}>
                    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '2rem' }}>"{test.quote}"</p>
                    <div>
                      <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>{test.author}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{test.title}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: '#fff' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Have a Project in Mind?</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Let's collaborate to bring your innovative ideas to life. I'm ready to tackle your next engineering challenge.
          </p>
          <Link to="/contact" style={{ display: 'inline-block', background: '#fff', color: 'var(--accent-secondary)', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1.1rem', transition: 'transform 0.3s ease' }}>
            Request a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
