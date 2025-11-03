import React, { useState, useEffect } from 'react';
import { Advisor } from '../../types';
import { fetchCollectionWithIds, addAdvisor, updateAdvisor, deleteAdvisor } from '../../services/dataService';

// Form Component
const AdvisorForm: React.FC<{
    advisor: Partial<Advisor> | null;
    onSave: (data: Partial<Advisor>) => void;
    onCancel: () => void;
}> = ({ advisor, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Advisor>>(
        advisor || { name: '', designation: '', photoUrl: '' }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{advisor?.id ? 'Edit Advisor' : 'Add New Advisor'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                    <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" required />
                    <input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="Photo URL" required />
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onCancel} className="btn-secondary !py-2">Cancel</button>
                        <button type="submit" className="btn-primary !py-2">Save Advisor</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Management Component
const ManageAdvisors: React.FC = () => {
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);

    const loadAdvisors = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCollectionWithIds<Advisor>('advisors');
            setAdvisors(data);
        } catch (err) {
            setError("Failed to load advisors.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdvisors();
    }, []);

    const handleSave = async (data: Partial<Advisor>) => {
        try {
            if (editingAdvisor?.id) {
                await updateAdvisor(editingAdvisor.id, data);
            } else {
                await addAdvisor(data as Omit<Advisor, 'id'>);
            }
            loadAdvisors();
        } catch (err) {
            console.error("Failed to save advisor", err);
            setError("Could not save advisor details.");
        } finally {
            setIsModalOpen(false);
            setEditingAdvisor(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this advisor?")) {
            try {
                await deleteAdvisor(id);
                loadAdvisors();
            } catch (err) {
                console.error("Failed to delete advisor", err);
                setError("Could not delete advisor.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Advisors</h1>
                <button onClick={() => { setEditingAdvisor(null); setIsModalOpen(true); }} className="btn-primary !py-2">Add New Advisor</button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
            {isModalOpen && <AdvisorForm advisor={editingAdvisor} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}

            {loading ? <p>Loading advisors...</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3">Name</th>
                                <th className="p-3">Designation</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advisors.map(advisor => (
                                <tr key={advisor.id} className="border-b">
                                    <td className="p-3 font-semibold">{advisor.name}</td>
                                    <td className="p-3">{advisor.designation}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => { setEditingAdvisor(advisor); setIsModalOpen(true); }} className="text-blue-600 hover:underline mr-4">Edit</button>
                                        <button onClick={() => handleDelete(advisor.id!)} className="text-red-600 hover:underline">Delete</button>
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

export default ManageAdvisors;