import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../../types';
import { fetchCollectionWithIds, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../services/dataService';

const GalleryItemForm: React.FC<{
    item: Partial<GalleryItem> | null;
    onSave: (data: Partial<GalleryItem>) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<GalleryItem>>(
        item || { title: '', type: 'photo', url: '', event: '', year: new Date().getFullYear() }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? parseInt(value, 10) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">{item?.id ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                    </select>
                    <input name="url" value={formData.url} onChange={handleChange} placeholder="Image URL or YouTube Embed URL" required />
                    <input name="event" value={formData.event} onChange={handleChange} placeholder="Associated Event Name" required />
                    <input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="Year" required />
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onCancel} className="btn-secondary !py-2">Cancel</button>
                        <button type="submit" className="btn-primary !py-2">Save Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ManageGallery: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    const loadItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCollectionWithIds<GalleryItem>('galleryItems');
            setItems(data.sort((a, b) => b.year - a.year));
        } catch (err) {
            setError("Failed to load gallery items.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadItems(); }, []);

    const handleSave = async (data: Partial<GalleryItem>) => {
        if (data.year && typeof data.year === 'string') {
            data.year = parseInt(data.year, 10);
        }
        try {
            if (editingItem?.id) {
                await updateGalleryItem(editingItem.id, data);
            } else {
                await addGalleryItem(data as Omit<GalleryItem, 'id'>);
            }
            loadItems();
        } catch (err) {
            setError("Could not save gallery item.");
        } finally {
            setIsModalOpen(false);
            setEditingItem(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this gallery item?")) {
            try {
                await deleteGalleryItem(id);
                loadItems();
            } catch (err) {
                setError("Could not delete gallery item.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Gallery</h1>
                <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="btn-primary !py-2">Add New Item</button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
            {isModalOpen && <GalleryItemForm item={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}

            {loading ? <p>Loading items...</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-100"><th className="p-3">Title</th><th className="p-3">Type</th><th className="p-3">Event</th><th className="p-3">Year</th><th className="p-3 text-right">Actions</th></tr></thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-3 font-semibold">{item.title}</td>
                                    <td className="p-3 capitalize">{item.type}</td>
                                    <td className="p-3">{item.event}</td>
                                    <td className="p-3">{item.year}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-blue-600 hover:underline mr-4">Edit</button>
                                        <button onClick={() => handleDelete(item.id!)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageGallery;