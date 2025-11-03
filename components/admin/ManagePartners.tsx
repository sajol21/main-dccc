import React, { useState, useEffect } from 'react';
import { Partner } from '../../types';
import { fetchCollectionWithIds, addPartner, updatePartner, deletePartner } from '../../services/dataService';

const PartnerForm: React.FC<{
    partner: Partial<Partner> | null;
    onSave: (data: Partial<Partner>) => void;
    onCancel: () => void;
}> = ({ partner, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Partner>>(
        partner || { name: '', logoUrl: '', description: '', type: 'sponsor' }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">{partner?.id ? 'Edit Partner' : 'Add New Partner'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Partner Name" required />
                    <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="Logo URL" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="h-24" />
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="institutional">Institutional</option>
                        <option value="sponsor">Sponsor</option>
                        <option value="media">Media</option>
                    </select>
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onCancel} className="btn-secondary !py-2">Cancel</button>
                        <button type="submit" className="btn-primary !py-2">Save Partner</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManagePartners: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

    const loadPartners = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCollectionWithIds<Partner>('partners');
            setPartners(data);
        } catch (err) {
            setError("Failed to load partners.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPartners(); }, []);

    const handleSave = async (data: Partial<Partner>) => {
        try {
            if (editingPartner?.id) {
                await updatePartner(editingPartner.id, data);
            } else {
                await addPartner(data as Omit<Partner, 'id'>);
            }
            loadPartners();
        } catch (err) {
            setError("Could not save partner.");
        } finally {
            setIsModalOpen(false);
            setEditingPartner(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this partner?")) {
            try {
                await deletePartner(id);
                loadPartners();
            } catch (err) {
                setError("Could not delete partner.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Partners</h1>
                <button onClick={() => { setEditingPartner(null); setIsModalOpen(true); }} className="btn-primary !py-2">Add New Partner</button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
            {isModalOpen && <PartnerForm partner={editingPartner} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}

            {loading ? <p>Loading partners...</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-100"><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3 text-right">Actions</th></tr></thead>
                        <tbody>
                            {partners.map(p => (
                                <tr key={p.id} className="border-b">
                                    <td className="p-3 font-semibold">{p.name}</td>
                                    <td className="p-3 capitalize">{p.type}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => { setEditingPartner(p); setIsModalOpen(true); }} className="text-blue-600 hover:underline mr-4">Edit</button>
                                        <button onClick={() => handleDelete(p.id!)} className="text-red-600 hover:underline">Delete</button>
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

export default ManagePartners;