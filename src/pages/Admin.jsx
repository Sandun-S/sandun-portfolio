import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('projects');
  
  // States for projects
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  
  // Generic form state
  const [formData, setFormData] = useState({ title: '', summary: '', category: '', imageUrl: '', liveUrl: '', githubUrl: '', description: '' });

  useEffect(() => {
    // We only load case studies for simplicity in this revamped admin
    const qProjects = query(collection(db, 'case_studies'), orderBy('title'));
    return onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleOpenForm = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setFormData({
        title: proj.title || '',
        summary: proj.summary || '',
        category: Array.isArray(proj.category) ? proj.category.join(', ') : proj.category || '',
        imageUrl: proj.imageUrl || '',
        liveUrl: proj.liveUrl || '',
        githubUrl: proj.githubUrl || '',
        description: proj.description || ''
      });
    } else {
      setEditingProject(null);
      setFormData({ title: '', summary: '', category: '', imageUrl: '', liveUrl: '', githubUrl: '', description: '' });
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        category: formData.category.split(',').map(c => c.trim())
      };

      if (editingProject) {
        await updateDoc(doc(db, 'case_studies', editingProject.id), dataToSave);
      } else {
        await addDoc(collection(db, 'case_studies'), dataToSave);
      }
      setEditingProject(null);
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving project.');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, 'case_studies', id));
      } catch(err) {
        console.error(err);
        alert('Error deleting');
      }
    }
  };

  return (
    <div className="container section animate-fade-in-up" style={{ paddingTop: '8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Add New Project
        </button>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Render Form if active */}
        {editingProject !== undefined && (
          <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem' }}>{editingProject === null ? 'Create New Project' : 'Edit Project'}</h3>
              <button onClick={() => setEditingProject(undefined)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveProject} style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div><label>Title</label><input required className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                <div><label>Category (comma separated)</label><input required className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
                <div><label>Image URL</label><input required className="admin-input" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} /></div>
                <div><label>Summary</label><input required className="admin-input" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} /></div>
                <div><label>Live URL</label><input className="admin-input" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} /></div>
                <div><label>GitHub URL</label><input className="admin-input" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} /></div>
              </div>
              <div><label>Detailed Description</label><textarea rows="5" className="admin-input" style={{ resize: 'vertical' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}><Save size={18} /> {editingProject === null ? 'Create' : 'Save Changes'}</button>
            </form>
          </div>
        )}

        {/* Render List */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Portfolio Projects</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', background: `url(${p.imageUrl}) center/cover`, borderRadius: '4px' }} />
                  <div>
                    <strong style={{ display: 'block' }}>{p.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{Array.isArray(p.category) ? p.category.join(', ') : p.category}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenForm(p)} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '4px' }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteProject(p.id)} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '4px', color: '#ef4444', borderColor: '#ef4444' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .admin-input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          color: var(--text-primary);
          outline: none;
          margin-top: 0.5rem;
        }
        .admin-input:focus {
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
