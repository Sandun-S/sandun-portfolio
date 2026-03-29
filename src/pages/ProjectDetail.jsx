import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'case_studies', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Project not found");
        }
      } catch (err) {
        setError("Error fetching project");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);

  if (loading) return <div className="section container text-center" style={{ paddingTop: '8rem' }}>Loading project details...</div>;
  if (error) return <div className="section container text-center" style={{ paddingTop: '8rem', color: 'red' }}>{error} <br/><br/><Link to="/case-studies" className="btn btn-secondary">Go Back</Link></div>;
  if (!project) return null;

  return (
    <div className="animate-fade-in-up">
      {/* Header Banner */}
      <section style={{ 
        height: '50vh', 
        minHeight: '400px',
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${project.imageUrl || 'https://placehold.co/1200x600/0ea5e9/FFF?text=Hero'}) center/cover no-repeat`,
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container">
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', opacity: 0.8 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.8}>
            <ArrowLeft size={20} /> Back to Case Studies
          </button>
          
          <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--accent-primary)', color: '#fff', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            {Array.isArray(project.category) ? project.category.join(' / ') : project.category}
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{project.title}</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '800px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{project.summary}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', lg: { gridTemplateColumns: '3fr 1fr' }, gap: '3rem' }}>
          
          {/* Main Description */}
          <div style={{ flex: '1 1 70%' }}>
            <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Overview</h2>
              
              {/* If project has rich text HTML, dangerously set it, else show pre-wrap */}
              {project.content ? (
                <div dangerouslySetInnerHTML={{ __html: project.content }} style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)' }} className="project-html-content" />
              ) : (
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                  {project.description || "Detailed description is being updated."}
                </p>
              )}
            </div>
            
            {/* Gallery (if exists) */}
            {project.gallery && project.gallery.length > 0 && (
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Project Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {project.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`${project.title} screenshot ${i+1}`} style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover', height: '200px', border: '1px solid var(--glass-border)' }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Meta info */}
          <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Project Details</h3>
              
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Calendar size={20} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date / Year</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{project.date || '2023 - Present'}</strong>
                  </div>
                </li>
                {project.client && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Tag size={20} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Client</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{project.client}</strong>
                    </div>
                  </li>
                )}
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                   <Code size={20} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Technologies</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {Array.isArray(project.techStack) ? project.techStack.map(t => (
                        <span key={t} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-primary)', borderRadius: '4px' }}>{t}</span>
                      )) : <span style={{ color: 'var(--text-primary)' }}>{project.techStack || 'Embedded C, PCB Design'}</span>}
                    </div>
                  </div>
                </li>
              </ul>

              {/* Action Buttons */}
              <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Live <ExternalLink size={18} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Source Code <Github size={18} />
                  </a>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>
      
      {/* Global Style injections for rich text html styling (optional) */}
      <style>{`
        .project-html-content h3 { margin-top: 2rem; margin-bottom: 1rem; color: var(--text-primary); }
        .project-html-content p { margin-bottom: 1.5rem; }
        .project-html-content ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style: disc; }
        .project-html-content li { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
