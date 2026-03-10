"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Tag, Copy, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '@/data/products';

export default function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [editVariations, setEditVariations] = useState<{ id: number, option: string, price: number }[]>([]);

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        if (product.isVariable && product.variations && product.variables) {
            const varName = product.variables[0]?.name || "Option";
            const mapped = product.variations.map(v => ({
                id: v.id,
                option: v.attributes[varName] || Object.values(v.attributes)[0] || '',
                price: v.price || product.price
            }));
            setEditVariations(mapped);
        } else {
            setEditVariations([]);
        }
        setIsAddModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setEditVariations([]);
        setIsAddModalOpen(true);
    };

    // Fetch products on load
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error: unknown) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
                toast.success('Product deleted successfully');
            } else {
                throw new Error();
            }
        } catch (error: unknown) {
            toast.error('Failed to delete product');
        }
        setDeleteConfirm(null);
    };

    const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const isVariable = editVariations.length > 0;
        const variables = isVariable ? [{ name: "Option", options: editVariations.map(v => v.option) }] : [];
        const variations = isVariable ? editVariations.map((v, i) => ({
            id: v.id || Date.now() + i,
            attributes: { "Option": v.option },
            price: v.price
        })) : [];

        const productData: Partial<Product> & { id: string } = {
            id: editingProduct?.id || `prod_${Date.now()}`,
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            category: formData.get('category') as Product['category'],
            form: formData.get('form') as Product['form'],
            description: formData.get('description') as string,
            image: formData.get('image') as string,
            stockStatus: formData.get('stockStatus') as Product['stockStatus'],
            isVariable: isVariable,
            variables: variables,
            variations: variations
        };

        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                toast.success(editingProduct ? 'Product updated' : 'Product added');
                fetchProducts();
                setIsAddModalOpen(false);
                setEditingProduct(null);
            } else {
                throw new Error();
            }
        } catch (error: unknown) {
            toast.error('Failed to save product');
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-slate-400">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Products</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage your {products.length} products, pricing, and variations.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-sky-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 font-bold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category / Form</th>
                                <th className="px-6 py-4">Base Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                                <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]" title={product.name}>
                                                    {product.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono">{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900 dark:text-slate-200 font-medium">{product.category}</div>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{product.form}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                        {product.isVariable && <span className="ml-1 text-[10px] text-primary">(Variable)</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${product.stockStatus === 'In Stock' ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' :
                                            product.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                            }`}>
                                            {product.stockStatus || 'In Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEditModal(product)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No products found matching &quot;{searchTerm}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal (Add/Edit) */}
            {(isAddModalOpen || editingProduct) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} />
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl z-10 overflow-hidden relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-20">
                            <h2 className="text-xl font-bold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="text-slate-400 hover:text-white transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full">
                            <form id="productForm" onSubmit={handleSaveProduct} className="flex flex-col gap-6 w-full">
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-sm font-bold text-slate-300">Product Name</label>
                                    <input name="name" required defaultValue={editingProduct?.name || ''} className="flex w-full rounded-xl border border-slate-700 bg-slate-800 text-white h-11 px-4 focus:ring-2 focus:ring-primary focus:border-primary" type="text" placeholder="e.g. BPC-157" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-sm font-bold text-slate-300">Base Price ($)</label>
                                        <input name="price" required defaultValue={editingProduct?.price || ''} className="flex w-full rounded-xl border border-slate-700 bg-slate-800 text-white h-11 px-4 focus:ring-2 focus:ring-primary focus:border-primary" type="number" step="0.01" />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-sm font-bold text-slate-300">Stock Status</label>
                                        <select name="stockStatus" defaultValue={editingProduct?.stockStatus || 'In Stock'} className="flex w-full rounded-xl border border-slate-700 bg-slate-800 text-white h-11 px-4 focus:ring-2 focus:ring-primary focus:border-primary">
                                            <option>In Stock</option>
                                            <option>Low Stock</option>
                                            <option>Out of Stock</option>
                                            <option>Coming Soon</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-sm font-bold text-slate-300">Category</label>
                                        <select name="category" defaultValue={editingProduct?.category || 'Peptide Capsules'} className="flex w-full rounded-xl border border-slate-700 bg-slate-800 text-white h-11 px-4 focus:ring-2 focus:ring-primary focus:border-primary">
                                            <option>Peptide Vials</option>
                                            <option>Peptide Capsules</option>
                                            <option>Bioregulator Capsules</option>
                                            <option>Bioregulator Creams</option>
                                            <option>Bioregulator Vials</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-sm font-bold text-slate-300">Form</label>
                                        <select name="form" defaultValue={editingProduct?.form || 'Capsule'} className="flex w-full rounded-xl border border-slate-700 bg-slate-800 text-white h-11 px-4 focus:ring-2 focus:ring-primary focus:border-primary">
                                            <option>Vial</option>
                                            <option>Capsule</option>
                                            <option>Cream</option>
                                            <option>Solution</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-sm font-bold text-slate-300">Image URL</label>
                                    <input name="image" defaultValue={editingProduct?.image || ''} className="flex w-full rounded-xl border border-slate-700 bg-slate-800 text-white h-11 px-4 focus:ring-2 focus:ring-primary focus:border-primary" type="text" placeholder="https://..." />
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-sm font-bold text-slate-300">Description</label>
                                    <textarea name="description" defaultValue={editingProduct?.description || ''} className="flex w-full rounded-xl border border-slate-700 bg-slate-800 text-white p-4 min-h-[100px] focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Product details..."></textarea>
                                </div>

                                <div className="flex flex-col gap-4 p-4 mt-2 bg-slate-800/50 rounded-xl border border-slate-700 w-full">
                                    <h3 className="text-sm font-bold text-slate-300 flex justify-between items-center">
                                        Options & Variations
                                        <button
                                            type="button"
                                            onClick={() => setEditVariations([...editVariations, { id: Date.now(), option: '', price: editingProduct?.price || 0 }])}
                                            className="flex items-center gap-1 text-xs text-primary hover:text-sky-400 bg-primary/10 px-2 py-1 rounded"
                                        >
                                            <Plus className="w-3 h-3" /> Add Option
                                        </button>
                                    </h3>

                                    {editVariations.length === 0 ? (
                                        <p className="text-xs text-slate-500">No variations added. Product will use the base price.</p>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {editVariations.map((v, index) => (
                                                <div key={v.id} className="flex gap-3 items-center">
                                                    <div className="flex-1">
                                                        <input
                                                            value={v.option}
                                                            onChange={(e) => {
                                                                const newVars = [...editVariations];
                                                                newVars[index].option = e.target.value;
                                                                setEditVariations(newVars);
                                                            }}
                                                            placeholder="Option (e.g. 5mg, 30 Count)"
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 text-white h-9 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="w-24">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={v.price}
                                                            onChange={(e) => {
                                                                const newVars = [...editVariations];
                                                                newVars[index].price = parseFloat(e.target.value);
                                                                setEditVariations(newVars);
                                                            }}
                                                            placeholder="Price"
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 text-white h-9 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                                            required
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditVariations(editVariations.filter((_, i) => i !== index))}
                                                        className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-800 bg-slate-900/95 sticky bottom-0 z-20 flex justify-end gap-3">
                            <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="px-5 py-2.5 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors">Cancel</button>
                            <button type="submit" form="productForm" className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-sky-500 transition-colors">Save Product</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl z-10 overflow-hidden relative flex flex-col p-6 text-center">
                        <div className="w-12 h-12 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Delete Product</h2>
                        <p className="text-sm text-slate-400 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
