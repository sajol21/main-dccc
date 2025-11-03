import React, { useState, useEffect } from 'react';
import { Publication } from '../../types';
import { fetchCollectionWithIds, addPublication, updatePublication, deletePublication } from '../../services/dataService';

const PublicationForm: React.FC<{
    publication: Partial<Publication> | null;
    onSave: (data: Partial<Publication>) => void;
    onCancel: () => void;
}> = ({ publication, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Publication>>(
        publication || { title: '', author: '', category: 'Literature', imageUrl: '', excerpt: '', content: '', isFeatured: false }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{publication?.id ? 'Edit Publication' : 'Add New Publication'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
                    <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" required />
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="Literature">Literature</option>
                        <option value="Opinion">Opinion</option>
                        <option value="Culture">Culture</option>
                    </select>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required />
                    <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Excerpt (short summary)" required className="h-24" />
                    <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Full Content (optional)" className="h-40" />
                    <div className="flex items-center">
                        <input name="isFeatured" type="checkbox" checked={!!formData.isFeatured} onChange={handleChange} className="h-4 w-4 rounded" id="isFeatured" />
                        <label htmlFor="isFeatured" className="ml-2 text-sm text-dc-text">Mark as featured post</label>
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onCancel} className="btn-secondary !py-2">Cancel</button>
                        <button type="submit" className="btn-primary !py-2">Save Publication</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManagePublications: React.FC = () => {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPub, setEditingPub] = useState<Publication | null>(null);

    const loadPublications = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCollectionWithIds<Publication>('publications');
            setPublications(data);
        } catch (err) {
            setError("Failed to load publications.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPublications(); }, []);

    const handleSave = async (data: Partial<Publication>) => {
        try {
            if (editingPub?.id) {
                await updatePublication(editingPub.id, data);
            } else {
                await addPublication(data as Omit<Publication, 'id'>);
            }
            loadPublications();
        } catch (err) {
            setError("Could not save publication.");
        } finally {
            setIsModalOpen(false);
            setEditingPub(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this publication?")) {
            try {
                await deletePublication(id);
                loadPublications();
            } catch (err) {
                setError("Could not delete publication.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Publications</h1>
                <button onClick={() => { setEditingPub(null); setIsModalOpen(true); }} className="btn-primary !py-2">Add New Publication</button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
            {isModalOpen && <PublicationForm publication={editingPub} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}

            {loading ? <p>Loading publications...</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-100"><th className="p-3">Title</th><th className="p-3">Author</th><th className="p-3">Category</th><th className="p-3">Featured</th><th className="p-3 text-right">Actions</th></tr></thead>
                        <tbody>
                            {publications.map(pub => (
                                <tr key={pub.id} className="border-b">
                                    <td className="p-3 font-semibold">{pub.title}</td>
                                    <td className="p-3">{pub.author}</td>
                                    <td className="p-3">{pub.category}</td>
                                    <td className="p-3">{pub.isFeatured ? 'Yes' : 'No'}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => { setEditingPub(pub); setIsModalOpen(true); }} className="text-blue-600 hover:underline mr-4">Edit</button>
                                        <button onClick={() => handleDelete(pub.id!)} className="text-red-600 hover:underline">Delete</button>
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

export default ManagePublications;