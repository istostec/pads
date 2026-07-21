/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight, CheckCircle } from 'lucide-react';
import { Product, Category } from '../types';

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (productId: string) => void;
  onNavigateToBulk: (productId: string) => void;
}

export default function ProductsView({ products, categories, onSelectProduct, onNavigateToBulk }: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'newest'>('newest');

  // Filter & Search Products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.status === 'Active');

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.productType.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full border border-brand-purple/20">
          Clinical Product Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 tracking-tight">
          Women's Hygiene &amp; Safety Formulations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          Discover certified hypoallergenic sanitary pads engineered for active protection, complete fluid retention, and continuous absolute comfort. Filter by size or flow to find your perfect fit.
        </p>
      </div>

      {/* Search, Filter & Sort Controls Grid */}
      <div className="bg-white p-6 rounded-2xl border border-brand-lavender/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, sizes, features (e.g. XL, Overnights...)"
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
          />
        </div>

        {/* Filter Tab Buttons / Category Dropdown */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              selectedCategory === 'all'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'bg-brand-clinical border border-brand-lavender text-gray-600 hover:bg-brand-lavender/40'
            }`}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-brand-dark text-white shadow-sm'
                  : 'bg-brand-clinical border border-brand-lavender text-gray-600 hover:bg-brand-lavender/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-brand-lavender rounded-xl px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-brand-dark cursor-pointer bg-brand-clinical font-medium"
          >
            <option value="newest">Latest Releases</option>
            <option value="name-asc">Alphabetical A-Z</option>
            <option value="name-desc">Alphabetical Z-A</option>
          </select>
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-brand-lavender hover:border-brand-purple/50 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden"
            >
              
              {/* Image Frame */}
              <div className="relative aspect-[4/3] bg-brand-blue/20 flex items-center justify-center p-6 cursor-pointer" onClick={() => onSelectProduct(prod.id)}>
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-102 transition-transform duration-300"
                />
                
                {/* Category name tag */}
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white text-[9px] font-bold text-brand-dark uppercase tracking-wider font-mono border border-brand-purple/30">
                  {prod.categoryName || 'Hygiene'}
                </span>

                {/* Stock Status */}
                <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase border ${
                  prod.stockStatus === 'In Stock'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {prod.stockStatus}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => onSelectProduct(prod.id)}
                    className="text-base font-heading font-extrabold text-gray-900 group-hover:text-brand-dark cursor-pointer transition-colors line-clamp-1"
                  >
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {prod.features.slice(0, 3).map((feat, index) => (
                      <span
                        key={index}
                        className="bg-brand-clinical border border-brand-purple/20 text-[9px] text-gray-600 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-brand-dark shrink-0" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-4 border-t border-brand-lavender space-y-2">
                  <div className="flex gap-2">
                    <a
                      href={prod.amazonLink || 'https://www.amazon.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-2.5 border border-brand-purple text-brand-dark hover:bg-brand-lavender/30 text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Amazon Shop
                    </a>
                    <a
                      href={prod.flipkartLink || 'https://www.flipkart.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-2.5 border border-brand-purple text-brand-dark hover:bg-brand-lavender/30 text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Flipkart Shop
                    </a>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onSelectProduct(prod.id)}
                      className="flex-1 py-2 bg-brand-clinical border border-brand-dark/20 text-brand-dark hover:border-brand-dark text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      Details
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigateToBulk(prod.id)}
                      className="flex-1 py-2 bg-brand-dark text-white text-xs font-semibold rounded-lg hover:bg-brand-darker transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Bulk Inquiry
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center bg-white p-12 rounded-3xl border border-brand-lavender max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-blue/30 mx-auto flex items-center justify-center border border-brand-purple/20">
            <SlidersHorizontal className="w-8 h-8 text-brand-dark" />
          </div>
          <h3 className="font-heading font-bold text-md text-gray-900">No Matching Product Formulations</h3>
          <p className="text-xs text-gray-500">
            No active medical pads found matching your filters. Try clearing search keywords or selecting all categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-brand-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Reset Catalog Explorer
          </button>
        </div>
      )}

    </div>
  );
}
