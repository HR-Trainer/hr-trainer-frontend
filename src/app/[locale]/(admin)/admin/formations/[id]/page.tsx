'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus, Edit2, Trash2, Video, FileText, CheckSquare, Loader2, X, Save, Sparkles } from 'lucide-react';

export default function CourseEditor() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSyllabus, setGeneratingSyllabus] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm, setModuleForm] = useState({
    titre: '',
    description: '',
    typeContenu: 'VIDEO',
    contenuUrl: '',
    duree: ''
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingCopilot, setGeneratingCopilot] = useState(false);

  const fetchCourseAndModules = async () => {
    if (!session?.user?.email) return;
    try {
      // Get course details (for title, etc.)
      const res = await fetch(`http://localhost:5000/api/formations/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      }

      // Get modules
      const resMod = await fetch(`http://localhost:5000/api/admin/formations/${courseId}/modules?adminEmail=${session.user.email}`);
      if (resMod.ok) {
        const dataMod = await resMod.json();
        setModules(dataMod);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseAndModules();
  }, [session, courseId]);

  const openAddModal = () => {
    setEditingModule(null);
    setModuleForm({ titre: '', description: '', typeContenu: 'VIDEO', contenuUrl: '', duree: '' });
    setShowModal(true);
  };

  const openEditModal = (mod: any) => {
    setEditingModule(mod);
    setModuleForm({
      titre: mod.titre,
      description: mod.description || '',
      typeContenu: mod.typeContenu || 'VIDEO',
      contenuUrl: mod.contenuUrl || '',
      duree: mod.duree ? mod.duree.toString() : ''
    });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:5000/api/admin/upload?adminEmail=${session?.user?.email}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setModuleForm({ ...moduleForm, contenuUrl: data.url });
      } else {
        alert('File upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingModule
        ? `http://localhost:5000/api/admin/modules/${editingModule.id}?adminEmail=${session?.user?.email}`
        : `http://localhost:5000/api/admin/formations/${courseId}/modules?adminEmail=${session?.user?.email}`;
      const method = editingModule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm)
      });

      if (res.ok) {
        setShowModal(false);
        fetchCourseAndModules();
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleGenerateSyllabus = async () => {
    setGeneratingSyllabus(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/formations/${courseId}/generate-syllabus?adminEmail=${session?.user?.email}`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchCourseAndModules();
      } else {
        alert("Erreur lors de la génération du plan de formation.");
      }
    } catch (err) {
      console.error(err);
    }
    setGeneratingSyllabus(false);
  };

  const handleCopilot = async () => {
    if (!moduleForm.description.trim()) {
      alert("Veuillez d'abord taper quelques mots-clés dans la description pour guider l'IA.");
      return;
    }
    setGeneratingCopilot(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/copilot?adminEmail=${session?.user?.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: moduleForm.description })
      });
      if (res.ok) {
        const data = await res.json();
        setModuleForm({ ...moduleForm, description: data.content });
      } else {
        alert("Erreur lors de la rédaction par l'IA.");
      }
    } catch (err) {
      console.error(err);
    }
    setGeneratingCopilot(false);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/modules/${moduleId}?adminEmail=${session?.user?.email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCourseAndModules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video size={16} className="text-[#0066FF]" />;
      case 'LECTURE': return <FileText size={16} className="text-emerald-500" />;
      case 'QUIZ': return <CheckSquare size={16} className="text-purple-500" />;
      default: return <Video size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'Video';
      case 'LECTURE': return 'Lecture';
      case 'QUIZ': return 'Quiz';
      default: return type;
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#0066FF]" size={32} /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl relative">
      <div className="mb-6">
        <Link href="/admin/formations" className="text-sm font-bold text-[#0066FF] hover:underline flex items-center gap-1 mb-4">
          <ChevronLeft size={16} /> Back to Courses
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{course?.titre || 'Course Editor'}</h1>
            <p className="text-slate-500 dark:text-gray-400 font-medium mt-1">Manage the modules and content for this course.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGenerateSyllabus}
              disabled={generatingSyllabus}
              className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold border border-indigo-200 hover:bg-indigo-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generatingSyllabus ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {generatingSyllabus ? 'Génération...' : 'Générer avec l\'IA'}
            </button>
            <button 
              onClick={openAddModal}
              className="bg-[#0066FF] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#0066FF]/20 hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Module
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-[1.5rem] border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {modules.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-slate-50 dark:bg-[#1f2937] text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-slate-100 dark:border-gray-800">
              <Video size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No modules yet</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 max-w-md mx-auto">This course is currently empty. Add videos, reading materials, or quizzes to build your curriculum.</p>
            <button onClick={openAddModal} className="text-[#0066FF] font-bold hover:underline">
              Create your first module
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {modules.map((mod, index) => (
              <div key={mod.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 dark:bg-transparent dark:hover:bg-[#1f2937] transition group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 border border-slate-200 dark:border-gray-700">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{mod.titre}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-700 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 shadow-sm">
                      {getTypeIcon(mod.typeContenu)}
                      {getTypeLabel(mod.typeContenu)}
                    </div>
                    {mod.duree && (
                      <span className="text-xs font-bold text-slate-400">{mod.duree} min</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-2 pr-12">{mod.description || 'No description provided.'}</p>
                  {mod.contenuUrl && (
                    <a href={mod.contenuUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#0066FF] hover:underline mt-2 inline-block">
                      View content link
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {mod.typeContenu === 'QUIZ' && (
                    <Link
                      href={`/admin/formations/${courseId}/modules/${mod.id}/quiz`}
                      className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                      title="Build Quiz"
                    >
                      <CheckSquare size={18} />
                    </Link>
                  )}
                  <button 
                    onClick={() => openEditModal(mod)}
                    className="p-2 rounded-lg text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 transition"
                    title="Edit Module"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteModule(mod.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Module"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Module Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50 dark:bg-[#1f2937]/50">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{editingModule ? 'Edit Module' : 'Add New Module'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:text-gray-300 transition bg-white dark:bg-[#111827] rounded-full p-1 border border-slate-200 dark:border-gray-700 shadow-sm"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveModule} className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-2">Module Title</label>
                  <input required type="text" value={moduleForm.titre} onChange={e => setModuleForm({...moduleForm, titre: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition" placeholder="e.g. Introduction to HR" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-2">Type</label>
                  <div className="relative">
                    <select value={moduleForm.typeContenu} onChange={e => setModuleForm({...moduleForm, typeContenu: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] appearance-none bg-white dark:bg-[#111827] font-bold text-slate-700 dark:text-gray-200 transition">
                      <option value="VIDEO">Video</option>
                      <option value="LECTURE">Lecture</option>
                      <option value="QUIZ">Quiz</option>
                    </select>
                    <div className="absolute left-3 top-3.5 pointer-events-none">
                      {getTypeIcon(moduleForm.typeContenu)}
                    </div>
                  </div>
                </div>
              </div>

              {moduleForm.typeContenu !== 'QUIZ' && (
                <div className="grid grid-cols-4 gap-5">
                  <div className="col-span-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-2">Content File (Video or PDF)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept={moduleForm.typeContenu === 'VIDEO' ? 'video/mp4,video/webm,video/ogg' : 'application/pdf'}
                        onChange={handleFileUpload} 
                        className="w-full px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0066FF] hover:file:bg-blue-100" 
                      />
                      {uploadingFile && <div className="absolute right-3 top-2.5 flex items-center text-xs font-bold text-[#0066FF]"><Loader2 size={16} className="animate-spin mr-1" /> Uploading...</div>}
                    </div>
                    {moduleForm.contenuUrl && (
                      <p className="text-xs text-emerald-600 mt-2 font-semibold">✓ File uploaded: <a href={moduleForm.contenuUrl} target="_blank" className="underline truncate inline-block max-w-[200px] align-bottom" rel="noreferrer">{moduleForm.contenuUrl.split('/').pop()}</a></p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-2">Duration (mins)</label>
                    <input type="number" min="1" value={moduleForm.duree} onChange={e => setModuleForm({...moduleForm, duree: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition" placeholder="18" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-200">Module Content / Description</label>
                  <button 
                    type="button"
                    onClick={handleCopilot}
                    disabled={generatingCopilot}
                    className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {generatingCopilot ? <Loader2 size={14} className="animate-spin" /> : <span>✨</span>}
                    {generatingCopilot ? 'Rédaction...' : 'Copilote IA'}
                  </button>
                </div>
                <textarea required value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition min-h-[160px] resize-y leading-relaxed" placeholder="Tapez quelques mots clés (ex: 'les 3 types de licenciement') puis cliquez sur Copilote IA..." />
              </div>

              {moduleForm.typeContenu === 'QUIZ' && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-800 flex items-center gap-3">
                  <CheckSquare className="flex-shrink-0" />
                  <p><strong>Note:</strong> Quiz creation requires navigating to the dedicated quiz builder after saving the module. (In this version, quizzes are attached separately via API).</p>
                </div>
              )}

            </form>
            
            <div className="px-8 py-5 border-t border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-[#1f2937]/50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:text-gray-200 hover:bg-slate-200/50 rounded-xl transition">Cancel</button>
              <button disabled={saving || uploadingFile} onClick={handleSaveModule} className="px-6 py-2.5 bg-[#0066FF] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#0066FF]/20 hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2">
                {(saving || uploadingFile) ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Module'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
