import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Loader } from '../components/Loader';
import api from '../services/api';
import { pageTransition, fadeInUp, staggerContainer } from '../animations/framer-variants';


export const Shop: React.FC = () => {


  const [searchParams, setSearchParams] = useSearchParams();


  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter settings states

  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'all');
  const [sortVal, setSortVal] = useState(searchParams.get('sort_by') || 'newest');

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        const catRes = await api.get('/categories');
        setCategories([{ id: 'all', name: 'All Categories', slug: 'all' }, ...catRes.data]);

        const params: any = {};
        if (selectedCat !== 'all') params.category = selectedCat;
        if (searchVal) params.search = searchVal;
        if (sortVal) params.sort_by = sortVal;

        const prodRes = await api.get('/products', { params });
        setProducts(prodRes.data);
      } catch (err) {
        console.error('API error during shop load', err);
        setCategories([{ id: 'all', name: 'All Categories', slug: 'all' }]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, [searchVal, selectedCat, sortVal]);



  const handleCategorySelect = (slug: string) => {
    setSelectedCat(slug);
    setSearchParams((prev) => {
      if (slug === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', slug);
      }
      return prev;
    });
  };

  const handleSortSelect = (val: string) => {
    setSortVal(val);
    setSearchParams((prev) => {
      prev.set('sort_by', val);
      return prev;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (searchVal) {
        prev.set('search', searchVal);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen"
    >
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200/60 pb-8 bg-white p-6 rounded-[24px] shadow-premium">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="font-serif text-3xl font-bold text-slate-800">Our Wellness Range</h1>
          <p className="text-slate-400 text-sm font-light">Organic, toxin-free comfort designed for your cycle.</p>
        </div>

        {/* Inline Keyword search form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-sm">
          <input
            type="text"
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-[#FF7A00] text-sm bg-[#FFF8F2]/50"
          />
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <button type="submit" className="hidden" />
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left filter panels: Column 1-3 */}
        <aside className="lg:col-span-3 space-y-6 bg-white p-6 rounded-[24px] shadow-premium border border-slate-100/50">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" />
            <h3 className="font-serif font-bold text-slate-800 text-base">Filter Options</h3>
          </div>

          {/* Categories Filter list */}
          <div className="space-y-3">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Categories</h4>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    selectedCat === cat.slug
                      ? 'bg-[#FF7A00] text-white shadow-premium shadow-[#FF7A00]/25'
                      : 'text-slate-600 hover:bg-[#FF7A00]/5 hover:text-[#FF7A00]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting settings */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sort By</h4>
            <select
              value={sortVal}
              onChange={(e) => handleSortSelect(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-[#FF7A00] bg-white cursor-pointer"
            >
              <option value="newest">Latest Arrivals</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
            </select>
          </div>

        </aside>

        {/* Right Product Grid listing: Column 4-12 */}
        <main className="lg:col-span-9">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] shadow-premium text-center px-4">
              <Filter className="w-10 h-10 text-slate-300 mb-4" />
              <h3 className="font-serif text-lg font-bold text-slate-700">No products found</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
                We couldn't find matches matching your filter options. Try selecting another comfort category.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((prod, idx) => (
                <motion.div key={prod.id} variants={fadeInUp} custom={idx}>
                  <ProductCard product={prod} />
                </motion.div>
              ))}

            </motion.div>


          )}
        </main>

      </div>
    </motion.div>
  );
};
export default Shop;
