'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, UserX, UserCheck, Shield, Mail, Phone, Building, Trash2, X, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedUserProgress, setSelectedUserProgress] = useState<any>(null);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // add User form state
  const [newUser, setNewUser] = useState({ email: '', password: '', nom: '', profil: 'PARTICULIER', role: 'ELEVE' });
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const fetchUsers = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users?adminEmail=${session.user.email}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const handleViewProgress = async (user: any) => {
    setSelectedUserProgress(user);
    setShowProgressModal(true);
    setLoadingProgress(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user.id}/progress?adminEmail=${session?.user?.email}`);
      if (res.ok) {
        const data = await res.json();
        setProgressData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProgress(false);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}?adminEmail=${session?.user?.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actif: !currentStatus })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleUserPremium = async (id: string, currentPremium: string) => {
    try {
      const newStatus = currentPremium === 'GRATUIT' ? 'PAYANT' : 'GRATUIT';
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}?adminEmail=${session?.user?.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statutAcces: newStatus })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatus('loading');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users?adminEmail=${session?.user?.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewUser({ email: '', password: '', nom: '', profil: 'PARTICULIER', role: 'ELEVE' });
        fetchUsers();
      } else {
        setAddStatus('error');
      }
    } catch (err) {
      setAddStatus('error');
    } finally {
      if (addStatus === 'loading') setAddStatus('idle'); // Reset if not already error
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userToDelete.id}?adminEmail=${session?.user?.email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
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
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium">Manage students, enterprise accounts, and admins.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-[1.5rem] border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-[#1f2937] border-b border-slate-100 dark:border-gray-800 text-slate-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Profile</th>
                <th className="px-6 py-4 font-bold">Access</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 dark:text-gray-400 overflow-hidden">
                        {user.photo ? <img src={user.photo} alt={user.nom} className="w-full h-full object-cover" /> : user.nom.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {user.nom}
                          {user.role === 'ADMIN' && <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-wider">Admin</span>}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.profil === 'ENTREPRISE' ? <Building size={14} className="text-[#0066FF]" /> : <Shield size={14} className="text-slate-400" />}
                      <span className="font-semibold text-slate-700 dark:text-gray-200 text-xs">{user.profil === 'ENTREPRISE' ? 'Company' : 'Individual'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleUserPremium(user.id, user.statutAcces)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition ${user.statutAcces === 'PAYANT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                    >
                      {user.statutAcces === 'PAYANT' ? 'Premium' : 'Free'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {user.actif ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.actif)}
                        className={`p-2 rounded-lg transition ${user.actif ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                        title={user.actif ? "Suspend User" : "Activate User"}
                      >
                        {user.actif ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button 
                        onClick={() => handleViewProgress(user)}
                        className="p-2 rounded-lg text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 transition"
                        title="View Progress"
                      >
                        <TrendingUp size={18} />
                      </button>
                      {user.email !== session?.user?.email && (
                        <button 
                          onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* add user modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:text-gray-300 transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1.5">Full Name</label>
                <input required type="text" value={newUser.nom} onChange={e => setNewUser({...newUser, nom: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1.5">Email Address</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1.5">Password</label>
                <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1.5">System Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]">
                    <option value="ELEVE">Learner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {newUser.role === 'ELEVE' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-200 mb-1.5">Profile Type</label>
                    <select value={newUser.profil} onChange={e => setNewUser({...newUser, profil: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]">
                      <option value="PARTICULIER">Individual</option>
                      <option value="ENTREPRISE">Company</option>
                    </select>
                  </div>
                )}
              </div>
              {addStatus === 'error' && <p className="text-red-500 text-xs font-bold">Failed to create user. Email may exist.</p>}
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:text-gray-200 transition">Cancel</button>
                <button disabled={addStatus === 'loading'} type="submit" className="px-5 py-2 bg-[#0066FF] text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-70">
                  {addStatus === 'loading' ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete user modal  */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center relative">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Delete User?</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
                Are you sure you want to permanently delete <strong className="text-slate-800 dark:text-gray-100">{userToDelete?.nom}</strong>? This action cannot be undone and will erase all their progress.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition"
                >
                  Yes, Delete User
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-3 bg-slate-50 dark:bg-[#1f2937] text-slate-600 dark:text-gray-300 font-bold rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* progress modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50 dark:bg-[#1f2937]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Progress: {selectedUserProgress?.nom}</h2>
              <button onClick={() => setShowProgressModal(false)} className="text-slate-400 hover:text-slate-600 dark:text-gray-300 transition"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {loadingProgress ? (
                <div className="flex justify-center items-center py-12"><Loader2 className="animate-spin text-[#0066FF]" size={32} /></div>
              ) : progressData.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-gray-400">
                  <p>This user is not enrolled in any courses yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {progressData.map((course: any) => (
                    <div key={course.formationId} className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-gray-700 p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">{course.titre}</h3>
                        <span className="text-sm font-bold text-[#0066FF]">{course.progression}%</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden">
                        <div 
                          className="bg-[#0066FF] h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${course.progression}%` }}
                        ></div>
                      </div>

                      {/* quiz scores */}
                      {course.quizScores && course.quizScores.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 dark:border-gray-800">
                          <h4 className="text-xs font-bold text-slate-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Quiz Scores</h4>
                          <div className="space-y-2">
                            {course.quizScores.map((quiz: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-[#1f2937] p-2.5 rounded-lg border border-slate-100 dark:border-gray-800">
                                <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{quiz.moduleTitle}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                  quiz.score >= 80 ? 'bg-green-100 text-green-700' :
                                  quiz.score >= 50 ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {quiz.score}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-gray-800 flex justify-end bg-slate-50 dark:bg-[#1f2937]">
              <button onClick={() => setShowProgressModal(false)} className="px-5 py-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 text-sm font-bold rounded-xl hover:bg-slate-50 dark:bg-[#1f2937] transition">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
