import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowRight, Filter } from 'lucide-react';

export default function CaseStudies() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const q = query(collection(db, 'case_studies'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projs);
      setFilteredProjects(projs);
      
      // Extract unique categories
      const allCats = new Set();
      projs.forEach(p => {
        if (Array.isArray(p.category)) p.category.forEach(c => allCats.add(c));
        else if (p.category) allCats.add(p.category);
      });
      setCategories(['All', ...Array.from(allCats)]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFilter = (cat) => {
    setActiveFilter(cat);
    if (cat === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => {
        if (Array.isArray(p.category)) return p.category.includes(cat);
        return p.category === cat;
      }));
    }
  };

  return (
    <div className="animate-fade-in-up">
      <section className="page-header" style={{ textAlign: 'center', padding: '6rem 0 3rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Case Studies</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            A deep dive into some of the most complex challenges I've solved.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          
          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => handleFilter(cat)}
                style={{ 
                  padding: '0.5rem 1.25rem', 
                  borderRadius: '9999px',
                  border: `1px solid ${activeFilter === cat ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                  background: activeFilter === cat ? 'var(--accent-primary)' : 'var(--glass-bg)',
                  color: activeFilter === cat ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 500
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No projects found for this category.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {filteredProjects.map(project => (
                <Link key={project.id} to={`/project/${project.id}`} className="glass" style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--glass-border)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: '100%', height: '220px', background: `url(${project.imageUrl || 'https://placehold.co/600x400/0ea5e9/FFF?text='+encodeURIComponent(project.title)}) center/cover no-repeat` }} />
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                      {Array.isArray(project.category) ? project.category.join(' / ') : project.category}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>{project.summary}</p>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-primary)', fontWeight: 600, gap: '0.5rem', marginTop: 'auto' }}>
                      View Details <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
