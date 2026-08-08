"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, AlertTriangle, X, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminFormations() {
  const { data: session } = useSession();
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<any>(null);
  
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Add Course Form State
  const [newCourse, setNewCourse] = useState({ 
    titre: '', 
    description: '', 
    niveau: 'DEBUTANT', 
    duree: 4, 
    gratuit: true, 
    publie: false,
    imageUrl: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const fetchFormations = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/formations?adminEmail=${session.user.email}`);
      const data = await res.json();
      setFormations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, [session]);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/formations/${id}?adminEmail=${session?.user?.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publie: !currentStatus })
      });
      if (res.ok) fetchFormations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatus('loading');
    try {
      const url = editingCourseId 
        ? `http://localhost:5000/api/admin/formations/${editingCourseId}?adminEmail=${session?.user?.email}`
        : `http://localhost:5000/api/admin/formations?adminEmail=${session?.user?.email}`;
      const method = editingCourseId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourse,
          duree: parseInt(newCourse.duree.toString())
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setEditingCourseId(null);
        setNewCourse({ titre: '', description: '', niveau: 'DEBUTANT', duree: 4, gratuit: true, publie: false, imageUrl: '' });
        fetchFormations();
      } else {
        setAddStatus('error');
      }
    } catch (err) {
      setAddStatus('error');
    } finally {
      if (addStatus === 'loading') setAddStatus('idle');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:5000/api/admin/upload?adminEmail=${session?.user?.email}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setNewCourse({ ...newCourse, imageUrl: data.url });
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const confirmDelete = async () => {
    if (!formationToDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/formations/${formationToDelete.id}?adminEmail=${session?.user?.email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setShowDeleteModal(false);
        setFormationToDelete(null);
        fetchFormations();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#0066FF]" size={32} /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Course Management</h1>
          <p className="text-slate-500 font-medium">Create, edit, and publish your HR courses.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCourseId(null);
            setNewCourse({ titre: '', description: '', niveau: 'DEBUTANT', duree: 4, gratuit: true, publie: false });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-[#0066FF] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#0066FF]/20 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Create Course
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">Course Title</th>
                <th className="px-6 py-4 font-bold">Level</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Stats</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {formations.map(formation => (
                <tr key={formation.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{formation.titre}</div>
                    <div className="text-xs text-slate-400 truncate max-w-xs">{formation.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">{formation.niveau}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${formation.gratuit ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {formation.gratuit ? 'Free' : 'Premium'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${formation.publie ? 'text-[#0066FF]' : 'text-slate-400'}`}>
                      {formation.publie ? <><div className="w-2 h-2 rounded-full bg-[#0066FF]"></div> Published</> : <><div className="w-2 h-2 rounded-full bg-slate-300"></div> Draft</>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-slate-500">
                      <div>{formation._count?.modules || 0} Modules</div>
                      <div>{formation._count?.inscriptions || 0} Students</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => togglePublish(formation.id, formation.publie)}
                        className="p-2 rounded-lg text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 transition"
                        title={formation.publie ? "Unpublish" : "Publish"}
                      >
                        {formation.publie ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <Link 
                        href={`/admin/formations/${formation.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition" 
                        title="Manage Modules"
                      >
                        <Settings size={18} />
                      </Link>
                      <button 
                        onClick={() => {
                          setEditingCourseId(formation.id);
                          setNewCourse({
                            titre: formation.titre,
                            description: formation.description,
                            niveau: formation.niveau,
                            duree: formation.duree ? parseInt(formation.duree) : 4,
                            gratuit: formation.gratuit,
                            publie: formation.publie,
                            imageUrl: formation.imageUrl || ''
                          });
                          setShowAddModal(true);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => { setFormationToDelete(formation); setShowDeleteModal(true); }} 
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {formations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No courses found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-slate-900">{editingCourseId ? 'Edit Course' : 'Create New Course'}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition bg-slate-50 hover:bg-slate-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCourse} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Course Title</label>
                <input required type="text" value={newCourse.titre} onChange={e => setNewCourse({...newCourse, titre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition" placeholder="e.g. Introduction to HR" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                <textarea required rows={3} value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition resize-none" placeholder="Course description..."></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Level</label>
                  <select value={newCourse.niveau} onChange={e => setNewCourse({...newCourse, niveau: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition">
                    <option value="DEBUTANT">Beginner</option>
                    <option value="INTERMEDIAIRE">Intermediate</option>
                    <option value="AVANCE">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration (Hours)</label>
                  <input required type="number" min="1" value={newCourse.duree} onChange={e => setNewCourse({...newCourse, duree: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cover Image</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0066FF] hover:file:bg-blue-100" 
                  />
                  {uploadingImage && <div className="absolute right-3 top-2.5 flex items-center text-xs font-bold text-[#0066FF]"><Loader2 size={16} className="animate-spin mr-1" /> Uploading...</div>}
                </div>
                {newCourse.imageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={newCourse.imageUrl} alt="Cover Preview" className="h-10 w-16 object-cover rounded-md border border-slate-200" />
                    <p className="text-xs text-emerald-600 font-semibold">✓ Image uploaded</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${newCourse.gratuit ? 'bg-[#0066FF] border-[#0066FF]' : 'bg-white border-slate-300 group-hover:border-[#0066FF]'}`}>
                    {newCourse.gratuit && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm font-bold text-slate-700">Free Access</span>
                  <input type="checkbox" checked={newCourse.gratuit} onChange={e => setNewCourse({...newCourse, gratuit: e.target.checked})} className="hidden" />
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${newCourse.publie ? 'bg-[#0066FF] border-[#0066FF]' : 'bg-white border-slate-300 group-hover:border-[#0066FF]'}`}>
                    {newCourse.publie && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm font-bold text-slate-700">Publish Immediately</span>
                  <input type="checkbox" checked={newCourse.publie} onChange={e => setNewCourse({...newCourse, publie: e.target.checked})} className="hidden" />
                </label>
              </div>

              {addStatus === 'error' && <p className="text-red-500 text-xs font-bold pt-2">Failed to create course. Please try again.</p>}
              
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                <button disabled={addStatus === 'loading' || uploadingImage} type="submit" className="px-6 py-2.5 bg-[#0066FF] text-white text-sm font-bold rounded-xl shadow-md shadow-[#0066FF]/20 hover:bg-blue-700 transition disabled:opacity-70">
                  {addStatus === 'loading' || uploadingImage ? 'Saving...' : editingCourseId ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center relative">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Delete Course?</h2>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to permanently delete <strong className="text-slate-800">{formationToDelete?.titre}</strong>? All associated modules and enrollments will be lost.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition"
                >
                  Yes, Delete Course
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
