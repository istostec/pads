import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import api from '../services/api';
import { pageTransition, fadeInUp, staggerContainer } from '../animations/framer-variants';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to load blog articles', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Loading articles...</div>;
  }

  // Blog Details Full screen view toggle
  if (selectedPost) {
    return (
      <motion.article
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-3xl mx-auto px-4 py-10 min-h-screen space-y-8"
      >
        <button
          onClick={() => setSelectedPost(null)}
          className="text-xs text-slate-500 hover:text-[#FF7A00] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
        >
          ← Back to Articles
        </button>

        <div className="space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            {selectedPost.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold border-b border-slate-100 pb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FF7A00]" />
              {new Date(selectedPost.published_at || selectedPost.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#FF7A00]" />
              {selectedPost.author}
            </span>
          </div>
        </div>

        {selectedPost.image_url && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-100 shadow-premium">
            <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="text-slate-600 font-light text-sm sm:text-base leading-relaxed space-y-6">
          {/* Parse content into paragraphs */}
          {selectedPost.content.split('\n\n').map((para: string, idx: number) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-12"
    >
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-[#FF7A00]" /> Wellness Editorial
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-light max-w-md mx-auto">
          Period hygiene research, dermatologist write-ups, and skin hydration tips.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            variants={fadeInUp}
            custom={idx}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-premium hover:shadow-premium-lg transition-all group flex flex-col justify-between"
          >
            <div>
              {post.image_url && (
                <div className="aspect-video w-full overflow-hidden bg-[#FFF8F2] border-b border-slate-50 relative">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#FF7A00]" />
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>

                <h3 className="font-serif font-bold text-slate-800 text-lg group-hover:text-[#FF7A00] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setSelectedPost(post)}
                className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
              >
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        ))}
      </motion.div>

    </motion.div>
  );
};
export default Blog;
