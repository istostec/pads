import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import api from '../frontend/src/services/api';

interface BlogProps {
  blogs: any[];
  refreshData: () => void;
}

export const BlogManagement: React.FC<BlogProps> = ({ blogs, refreshData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [author, setAuthor] = useState('Lumina Health Editorial');
  const [status, setStatus] = useState('Draft');

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle(''); setSlug(''); setContent('');
    setImgUrl('https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600');
    setAuthor('Lumina Health Editorial'); setStatus('Draft');
    setIsOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setImgUrl(post.image_url || '');
    setAuthor(post.author);
    setStatus(post.status);
    setIsOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content,
      image_url: imgUrl,
      author,
      status
    };

    try {
      if (editId) {
        await api.put(`/blogs/${editId}`, payload);
      } else {
        await api.post('/blogs', payload);
      }
      refreshData();
      setIsOpen(false);
    } catch (err) {
      console.warn('API Blog save failed, updating mock local state', err);
      // mockup edits
      if (editId) {
        blogs.forEach(b => {
          if (b.id === editId) {
             b.title = payload.title; b.slug = payload.slug; b.content = payload.content;
             b.image_url = payload.image_url; b.author = payload.author; b.status = payload.status;
          }
        });
      } else {
        blogs.push({ id: Date.now(), ...payload, published_at: new Date().toISOString() });
      }
      refreshData();
      setIsOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      refreshData();
    } catch (err) {
      console.warn('API delete failed, updating mockup state', err);
      const idx = blogs.findIndex(b => b.id === id);
      if (idx > -1) blogs.splice(idx, 1);
      refreshData();
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-800">Lumina Editorial Articles</h1>
          <p className="text-slate-400 text-xs font-light">Draft wellness write-ups, publish dermatological briefs, and edit layout covers.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1 bg-[#FF7A00] hover:bg-[#E06B00] text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-wider shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Write Article
        </button>
      </div>

      {/* Blogs list table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider bg-slate-50/50">
                <th className="p-4">Cover Image</th>
                <th className="p-4">Title details</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-light">No articles drafted yet.</td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/40">
                    <td className="p-4">
                      <div className="w-14 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <img src={b.image_url || 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=100'} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-serif font-bold text-slate-800 text-sm max-w-xs truncate">{b.title}</td>
                    <td className="p-4 font-semibold">{b.author}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        b.status === 'Published'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(b.published_at || b.created_at).toLocaleDateString()}</td>
                    <td className="p-4 space-x-1">
                      <button onClick={() => handleOpenEdit(b)} className="p-1.5 hover:bg-[#FF7A00]/5 hover:text-[#FF7A00] text-slate-400 rounded-xl cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-6 shadow-premium border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-[#FF7A00]" /> {editId ? 'Edit Article details' : 'Draft New Wellness Post'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Close</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Title *</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-[#FF7A00]" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Slug (Unique url name) *</label>
                <input type="text" placeholder="decoding-organic-pads" required value={slug} onChange={e => setSlug(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Cover Image URL</label>
                <input type="text" value={imgUrl} onChange={e => setImgUrl(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Article Author</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Article Content *</label>
                <textarea required rows={6} value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#FF7A00]" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Publication Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none cursor-pointer">
                  <option value="Draft">Draft (Offline)</option>
                  <option value="Published">Published (Public)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF7A00] hover:bg-[#E06B00] text-white font-bold uppercase tracking-wider rounded-full shadow-sm cursor-pointer"
              >
                Commit article changes
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default BlogManagement;
