import React, { useRef, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Sparkles } from 'lucide-react';
import api from '../frontend/src/services/api';
import { validateImageFile } from './src/utils/imageUpload';
import { getSafeImageSrc } from '../frontend/src/utils/imageSrc';





interface ProductsProps {
  products: any[];
  categories: any[];
  refreshData: () => void;
}

export const Products: React.FC<ProductsProps> = ({ products, categories, refreshData }) => {
  const [searchVal, setSearchVal] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  
  // Modal/Form toggle states
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>('');
  const [catId, setCatId] = useState(categories[0]?.id || 1);
  const [type, setType] = useState('Organic Pad');
  const [features, setFeatures] = useState('');
  const [sizes, setSizes] = useState('');
  const [qty, setQty] = useState(100);
  const [lowStock, setLowStock] = useState(10);

  type ImageItem = {
    id: string; // client-side only
    url: string; // preview url (blob:) or existing public url
    file?: File; // only before upload
    isNew?: boolean; // only for selected/new items
  };

  // For primary we keep preview/public url separately from the underlying File (if new)
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>('');
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);

  // Gallery list can contain both existing items (url only) and newly picked files (url + file)
  const [galleryImages, setGalleryImages] = useState<ImageItem[]>([]);


  const [status, setStatus] = useState('Active');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [imageErrorMsg, setImageErrorMsg] = useState<string>('');

  const primaryInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);


  const handleOpenCreate = () => {
    setEditId(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice(299);
    setCompareAtPrice(349);
    setCatId(categories[0]?.id || 1);
    setType('Organic Pad');
    setFeatures('GOTS Cotton, Rash-Free');
    setSizes('Regular (240mm), XL (280mm)');
    setQty(150);
    setLowStock(15);

    setPrimaryImageUrl('');
    setGalleryImages([]);

    setStatus('Active');
    setErrorMsg('');
    setImageErrorMsg('');
    setIsOpen(true);
  };


  const handleOpenEdit = (prod: any) => {
    console.log('[DEBUG admin/Products] handleOpenEdit: Product:', prod);
    console.log('[DEBUG admin/Products] handleOpenEdit: primary_image:', prod?.primary_image);
    console.log('[DEBUG admin/Products] handleOpenEdit: images:', prod?.images);
    console.log('[DEBUG admin/Products] state before set: primaryImageUrl=', primaryImageUrl);
    console.log('[DEBUG admin/Products] state before set: galleryImages=', galleryImages);


    setEditId(prod.id);
    setName(prod.name);
    setSlug(prod.slug);
    setDescription(prod.description);
    setPrice(prod.price);
    setCompareAtPrice(prod.compare_at_price || '');
    setCatId(prod.category_id || 1);
    setType(prod.product_type || '');
    setFeatures(Array.isArray(prod.features) ? prod.features.join(', ') : '');
    setSizes(Array.isArray(prod.sizes) ? prod.sizes.join(', ') : '');
    setQty(prod.quantity || 0);
    setLowStock(prod.low_stock_threshold || 10);

    const primary = prod.primary_image || '';
    const gallery = (prod.images || [])
      .map((i: any) => i.image_url)
      .filter(Boolean) as string[];

    console.log('[DEBUG admin/Products] computed primary=', primary);
    console.log('[DEBUG admin/Products] computed gallery(image_url list)=', gallery);


    // Populate client-side state: primary + gallery
    setPrimaryImageUrl(primary);
    console.log('[DEBUG admin/Products] primaryImageUrl after set (local var primary)=', primary);
    setPrimaryFile(null);


    // Treat gallery list as all non-primary images (but keep ordering)
    const galleryOnly = primary ? gallery.filter((u) => u !== primary) : gallery;
    setGalleryImages(galleryOnly.map((url) => ({ id: url, url })));

    setStatus(prod.status || 'Active');
    setErrorMsg('');
    setImageErrorMsg('');
    setIsOpen(true);
  };









  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];

    const fd = new FormData();
    for (const f of files) fd.append('images', f);

    const res = await api.post('/uploads/products-images', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.images as string[];
  };


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setImageErrorMsg('');

    const featuresList = features.split(',').map(f => f.trim()).filter(Boolean);
    const sizesList = sizes.split(',').map(s => s.trim()).filter(Boolean);

    // Validate required primary
    if (!primaryImageUrl) {
      setImageErrorMsg('Primary image is required.');
      return;
    }

    // Upload any new (not-yet uploaded) images (never persist blob: URLs)
    try {
      setUploadingImages(true);

      const newFiles: File[] = [];

      if (primaryFile) newFiles.push(primaryFile);
      for (const img of galleryImages) {
        if (img.file) newFiles.push(img.file);
      }

      // Upload only newly picked files
      const uploadedUrls = await uploadFiles(newFiles);

      // Replace: first returned URL is primary (if we uploaded primaryFile)
      let uploadedIdx = 0;
      const resolvedPrimary = primaryFile
        ? uploadedUrls[uploadedIdx++]
        : primaryImageUrl;

      // For gallery images, map each item:
      // - if item has file => take next returned public URL
      // - else => keep existing public url
      const resolvedGalleryUrls: string[] = galleryImages.map((img) => {
        if (img.file) {
          const url = uploadedUrls[uploadedIdx++];
          return url;
        }
        return img.url;
      });

      // Payload: primary_image + images[] (must not include primary twice)
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        category_id: Number(catId),
        product_type: type,
        features: featuresList,
        sizes: sizesList,
        quantity: Number(qty),
        low_stock_threshold: Number(lowStock),
        // Ensure we never persist preview-only blob URLs.
        primary_image:
          typeof resolvedPrimary === 'string' && resolvedPrimary.startsWith('blob:')
            ? uploadedUrls[0] // fallback to first uploaded url
            : resolvedPrimary,
        images: resolvedGalleryUrls
          .filter((u) => typeof u === 'string' && u !== resolvedPrimary)
          .filter((u) => typeof u === 'string' && !u.startsWith('blob:')),
        status,
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      refreshData();
      setIsOpen(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error processing request details.');
    } finally {
      setUploadingImages(false);
    }
  };


  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      refreshData();
    } catch (err) {
      alert('Deletion failed.');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal.toLowerCase()) || p.description?.toLowerCase().includes(searchVal.toLowerCase());
    const matchesCat = selectedCat === 'all' || String(p.category_id) === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-800">Lumina Comfort Catalog</h1>
          <p className="text-slate-400 text-xs font-light">Inventory details, product descriptors, and wing sizes configuration.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1 bg-[#FF7A00] hover:bg-[#E06B00] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters panels */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Keyword Search */}
        <div className="relative flex items-center w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#FF7A00]"
          />
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        </div>

        {/* Category filtering */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#FF7A00] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Products table grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider bg-slate-50/50">
                <th className="p-4">Image</th>
                <th className="p-4">Product details</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock level</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-light">No items found in Lumina collection.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/40">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          <img
                            src={getSafeImageSrc(p.primary_image)}
                            onError={(e) => {
                              const el = e.currentTarget;
                              el.src = getSafeImageSrc('');
                            }}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />

                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="font-serif font-bold text-slate-800 text-sm block leading-tight">{p.name}</span>
                      <span className="text-slate-400 font-light text-[10px] block uppercase">{p.product_type} • Category ID: {p.category_id}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#FF7A00]">₹{p.price.toFixed(2)}</span>
                      {p.compare_at_price && (
                        <span className="text-slate-400 line-through block text-[10px]">₹{p.compare_at_price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{p.quantity} Units</span>
                      {p.quantity <= p.low_stock_threshold && (
                        <span className="bg-red-50 text-red-500 font-bold border border-red-200 text-[8px] px-2 py-0.5 rounded-full block w-fit mt-1 uppercase">Low Stock</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        p.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-[#FF7A00]/5 hover:text-[#FF7A00] text-slate-400 rounded-xl cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl cursor-pointer"
                        title="Delete product"
                      >
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

      {/* Editor Modal Drawer popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 shadow-premium border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-slate-800 text-lg flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-[#FF7A00]" /> {editId ? 'Modify Comfort Product' : 'Add New comfort choice'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">Close</button>
            </div>

            {errorMsg && <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-200 p-2.5 rounded-xl">{errorMsg}</p>}

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Product Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-[#FF7A00]" />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Slug (Unique descriptor) *</label>
                <input type="text" placeholder="lumina-cotton-comfort" required value={slug} onChange={e => setSlug(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Price (₹) *</label>
                <input type="number" required value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Compare Price */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Compare At Price (₹)</label>
                <input type="number" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Category Link *</label>
                <select value={catId} onChange={e => setCatId(Number(e.target.value))} className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none cursor-pointer">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Product Type */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Product Type tag</label>
                <input type="text" value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Features */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Features (comma separated)</label>
                <input type="text" placeholder="100% Organic, Rash-free, Breathable" value={features} onChange={e => setFeatures(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Sizes */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Sizes (comma separated)</label>
                <input type="text" placeholder="Regular (240mm), XL (280mm)" value={sizes} onChange={e => setSizes(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Inventory quantity */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Inventory Stock *</label>
                <input type="number" required value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* Low Stock alert limit */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Low Stock Alert Threshold</label>
                <input type="number" value={lowStock} onChange={e => setLowStock(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              {/* 📷 Primary Product Image */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">📷 Primary Product Image</label>

                <input
                  ref={primaryInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const vErr = validateImageFile(file);
                    if (vErr) {
                      setImageErrorMsg(vErr);
                      return;
                    }
                    setImageErrorMsg('');

                    const clientId = `${Date.now()}-${file.name}`;
                    const previewUrl = URL.createObjectURL(file);

                    setPrimaryImageUrl(previewUrl);
                    setPrimaryFile(file);

                    // Also add/replace in gallery list so it uploads as well.
                    setGalleryImages((prev) => {
                      const withoutNewPrimary = prev.filter((x) => x.id !== clientId);
                      // remove old primary preview if it was a blob url
                      const withoutOldPrimaryPreview = primaryImageUrl
                        ? withoutNewPrimary.filter((x) => x.url !== primaryImageUrl)
                        : withoutNewPrimary;
                      const nextPrimary: ImageItem = { id: clientId, url: previewUrl, file, isNew: true };
                      return [nextPrimary, ...withoutOldPrimaryPreview];
                    });
                  }}
                />



                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    onClick={() => primaryInputRef.current?.click()}
                  >
                    Upload Image
                  </button>

                  {primaryImageUrl ? (
                    <button
                      type="button"
                      className="px-3 py-2 border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-50 cursor-pointer"
                      onClick={() => {
                        if (!window.confirm('Remove primary image?')) return;
                        const removedUrl = primaryImageUrl;
                        setPrimaryImageUrl('');
                        setGalleryImages((prev) => prev.filter((x) => x.url !== removedUrl));
                      }}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                {imageErrorMsg ? <p className="text-red-500 text-[10px] font-bold">{imageErrorMsg}</p> : null}

                {primaryImageUrl ? (
                  <img
                    src={(() => {
                      const src = getSafeImageSrc(primaryImageUrl);
                      console.log('[DEBUG admin/Products] <img primary> getSafeImageSrc input=', primaryImageUrl, 'output=', src);
                      return src;
                    })()}

                    onError={(e) => {
                      const el = e.currentTarget;
                      el.src = getSafeImageSrc('');
                    }}
                    alt="Primary preview"
                    className="w-full h-36 object-cover rounded-2xl border border-slate-100"
                  />
                ) : (
                  <div className="text-slate-400 text-[10px] font-bold">No primary image selected.</div>
                )}

              </div>

              {/* 🖼 Gallery Images */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">🖼 Gallery Images</label>

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;

                    for (const f of files) {
                      const vErr = validateImageFile(f);
                      if (vErr) {
                        setImageErrorMsg(vErr);
                        return;
                      }
                    }
                    setImageErrorMsg('');

                    const nextItems: ImageItem[] = files.map((f) => ({
                      id: `${Date.now()}-${f.name}`,
                      url: URL.createObjectURL(f),
                      file: f,
                    }));

                    setGalleryImages((prev) => [...nextItems, ...prev]);
                  }}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    Upload Multiple Images
                  </button>

                  <button
                    type="button"
                    className="px-3 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                    onClick={() => setGalleryImages([])}
                  >
                    Clear Gallery
                  </button>
                </div>

                {galleryImages.length ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {galleryImages.map((img) => {
                      const isPrimary = img.url === primaryImageUrl;
                      return (
                        <div key={img.id} className="relative rounded-2xl overflow-hidden border border-slate-100">
                          <img
                            src={getSafeImageSrc(img.url)}
                            onError={(e) => {
                              const el = e.currentTarget;
                              el.src = getSafeImageSrc('');
                            }}
                            alt="Gallery preview"
                            className="w-full h-20 object-cover"
                          />


                          {isPrimary && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#FF7A00] text-white text-[10px] font-bold rounded-full">
                              Primary
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 bg-black/40 flex items-center justify-between p-1">
                            <button
                              type="button"
                              disabled={!img.url}
                              className={`text-white text-[10px] font-bold px-2 py-0.5 rounded ${isPrimary ? 'bg-white/20 opacity-60 cursor-default' : 'bg-white/10 hover:bg-white/15 cursor-pointer'}`}
                              onClick={() => {
                                setPrimaryImageUrl(img.url);
                                setPrimaryFile(img.file ?? null);
                              }}



                              title="Set as primary"
                            >
                              Make Primary
                            </button>
                            <button
                              type="button"
                              className="text-white text-[10px] font-bold p-1 hover:bg-white/15 rounded cursor-pointer"
                              onClick={() => {
                                if (!window.confirm('Remove this image?')) return;
                                setGalleryImages((prev) => prev.filter((x) => x.id !== img.id));
                                if (img.url === primaryImageUrl) setPrimaryImageUrl('');
                              }}
                              title="Remove"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-slate-400 text-[10px] font-bold">No gallery images selected.</div>
                )}
              </div>


              {/* Status */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none cursor-pointer">
                  <option value="Active">Active storefront</option>
                  <option value="Draft">Draft (Invisible)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
                <button type="submit" className="px-6 py-2.5 bg-[#FF7A00] text-white font-bold uppercase tracking-wider rounded-full hover:bg-[#E06B00] cursor-pointer">
                  {editId ? 'Apply modifications' : 'Publish Product'}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-bold uppercase tracking-wider rounded-full hover:bg-slate-50 cursor-pointer">Cancel</button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
export default Products;
