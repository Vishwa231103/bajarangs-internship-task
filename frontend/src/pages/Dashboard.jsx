import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

export default function Dashboard() {
  // data + UI state
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const { user, logout } = useAuth?.() ?? { user: null, logout: () => {} }; // safe fallback
  const navigate = useNavigate?.() ?? (() => {});

  // fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks'); // adjust baseURL if needed
      setTasks(res.data || []);
    } catch (err) {
      console.error('fetchTasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // filtered list
  const filtered = tasks.filter(t =>
    t.title?.toLowerCase().includes(q.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(q.toLowerCase()))
  );

  // open modal for create
  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', status: 'pending' });
    setShowModal(true);
  };

  // open modal for edit
  const openEdit = (task) => {
    setEditing(task);
    setForm({ title: task.title || '', description: task.description || '', status: task.status || 'pending' });
    setShowModal(true);
  };

  // submit create/update
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!form.title.trim()) return;
    try {
      if (editing) {
        await axios.put(`/tasks/${editing._id || editing.id}`, form);
      } else {
        await axios.post('/tasks', form);
      }
      setShowModal(false);
      setEditing(null);
      setForm({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      console.error('save task', err);
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await axios.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('delete', err);
    }
  };

  // logout action
  const handleLogout = () => {
    try {
      logout?.();
    } catch (err) {
      console.warn('logout failed', err);
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 antialiased">
      {/* Fixed Glass Navbar */}
      <header className="fixed inset-x-4 top-4 z-50">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center justify-between backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-lg font-extrabold select-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                  TaskFlow
                </span>
              </div>
              <div className="hidden sm:block text-sm text-slate-700">Welcome, <span className="font-medium">{user?.name ?? user?.email ?? 'Guest'}</span></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right text-xs text-slate-600">
                <span className="font-semibold">{user?.name ?? '—'}</span>
                <span className="truncate w-36">{user?.email ?? ''}</span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg transform transition-transform hover:scale-105 shadow-md"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero + Controls */}
          <section className="rounded-2xl p-8 mb-8 bg-gradient-to-r from-indigo-50 to-pink-50 shadow-inner">
            <div className="md:flex md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">Organize your work. Ship faster.</h1>
                <p className="mt-3 text-lg text-slate-600 max-w-2xl">your work is in your finger tips.</p>
              </div>

              <div className="mt-6 md:mt-0 flex items-center gap-3">
                {/* Search bar with perfectly aligned icon */}
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search tasks, titles, descriptions..."
                    className="pl-11 pr-4 py-3 rounded-lg shadow-sm bg-white/90 border border-white/40 backdrop-blur-sm w-72 sm:w-96 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white/95 border border-white/30 rounded-lg shadow-md hover:scale-105 transform transition-transform"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="font-medium">Create New Task</span>
                </button>
              </div>
            </div>
          </section>

          {/* Tasks grid */}
          <section>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/30 bg-white/30 p-16 text-center backdrop-blur-md">
                <h2 className="text-3xl font-extrabold">No tasks yet</h2>
                <p className="mt-3 text-slate-600 max-w-xl mx-auto">You're all caught up! Create your first task and get momentum — little steps add up to big wins.</p>
                <div className="mt-6">
                  <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:-translate-y-1 transform transition">
                    <PlusIcon className="w-5 h-5" />
                    Create your first task
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((task) => (
                  <article
                    key={task._id ?? task.id}
                    className="rounded-2xl overflow-hidden bg-white/80 border border-white/40 shadow-md transform transition hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="p-4">
                      <div className="rounded-xl overflow-hidden">
                        {/* Gradient header */}
                        <div className="p-3 rounded-t-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                          <h3 className="text-lg font-bold truncate">{task.title}</h3>
                        </div>

                        <div className="p-4 bg-white/95">
                          <p className="text-sm text-slate-700 mb-3 max-h-[4.5rem] overflow-hidden">{task.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {task.status === 'completed' ? 'Completed' : 'Pending'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button onClick={() => openEdit(task)} className="p-2 rounded-md bg-gradient-to-br from-indigo-50 to-purple-50 hover:scale-105 transform transition shadow-sm" title="Edit">
                                <PencilSquareIcon className="w-5 h-5 text-indigo-700" />
                              </button>

                              <button onClick={() => handleDelete(task._id ?? task.id)} className="p-2 rounded-md bg-gradient-to-br from-red-50 to-pink-50 hover:scale-105 transform transition shadow-sm" title="Delete">
                                <TrashIcon className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal (create/edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative z-10 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
            <div className="bg-white/95 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    {editing ? 'Edit Task' : 'Create Task'}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">Add a concise title, optional description, and pick a status.</p>
                </div>

                <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-slate-100">
                  <XMarkIcon className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Title</span>
                  <input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                    className="mt-2 w-full rounded-lg p-4 border border-white/40 bg-white/90 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    placeholder="e.g. Design onboarding flow"/>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Description</span>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                    className="mt-2 w-full rounded-lg p-4 border border-white/40 bg-white/90 min-h-[120px] resize-none focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    placeholder="Optional details, acceptance criteria, links..."></textarea>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                    className="mt-2 w-48 rounded-lg p-3 border border-white/40 bg-white/90 focus:outline-none focus:ring-4 focus:ring-indigo-100">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <div className="flex items-center gap-3 mt-2">
                  <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:-translate-y-1 transform transition">
                    Save
                  </button>

                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-lg bg-gray-100 text-slate-700 font-medium hover:scale-105 transform transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
