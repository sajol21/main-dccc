import React, { useState, useEffect } from 'react';
import { Member } from '../../types';
import { fetchCollectionWithIds, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember } from '../../services/dataService';

const MemberForm: React.FC<{
    member: Partial<Member> | null;
    onSave: (memberData: Partial<Member>) => void;
    onCancel: () => void;
}> = ({ member, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Member>>(() => {
        const defaultData = {
            name: '',
            role: '',
            photoUrl: '',
            year: new Date().getFullYear(),
            socials: { facebook: '', linkedin: '' }
        };
        if (!member) return defaultData;
        // Deep merge to ensure socials object is always present and has all keys
        return {
            ...defaultData,
            ...member,
            socials: {
                ...defaultData.socials,
                ...(member.socials || {}),
            }
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? (parseInt(value, 10) || undefined) : value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socials: {
                ...(prev.socials || {}),
                [name]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold font-poppins text-dc-dark mb-6">{member?.id ? 'Edit Member' : 'Add New Member'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="sr-only">Full Name</label>
                        <input id="name" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Full Name" required />
                    </div>
                     <div>
                        <label htmlFor="role" className="sr-only">Role</label>
                        <input id="role" name="role" value={formData.role || ''} onChange={handleChange} placeholder="Role (e.g., President)" required />
                    </div>
                     <div>
                        <label htmlFor="photoUrl" className="sr-only">Photo URL</label>
                        <input id="photoUrl" name="photoUrl" value={formData.photoUrl || ''} onChange={handleChange} placeholder="Photo URL" required />
                    </div>
                     <div>
                        <label htmlFor="year" className="sr-only">Committee Year</label>
                        <input id="year" name="year" value={formData.year || ''} onChange={handleChange} type="number" placeholder="Committee Year" required />
                    </div>

                    <div className="pt-2">
                        <h3 className="text-lg font-semibold text-dc-text mb-2">Social Links (Optional)</h3>
                        <div className="space-y-3">
                            <div>
                               <label htmlFor="facebook" className="sr-only">Facebook URL</label>
                               <input id="facebook" name="facebook" value={formData.socials?.facebook || ''} onChange={handleSocialChange} placeholder="Facebook URL" />
                            </div>
                            <div>
                                <label htmlFor="linkedin" className="sr-only">LinkedIn URL</label>
                                <input id="linkedin" name="linkedin" value={formData.socials?.linkedin || ''} onChange={handleSocialChange} placeholder="LinkedIn URL" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="btn-secondary !py-2">Cancel</button>
                        <button type="submit" className="btn-primary !py-2">Save Member</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageCommittee: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadMembers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCollectionWithIds<Member>('committees');
            setMembers(data.sort((a,b) => (b.year || 0) - (a.year || 0) ));
        } catch (error) {
            console.error("Failed to load members", error);
            setError("Failed to load committee members. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleSave = async (memberData: Partial<Member>) => {
        setError(null);
        try {
            // Ensure year is a number
            if (memberData.year && typeof memberData.year === 'string') {
                memberData.year = parseInt(memberData.year, 10);
            }
            if (editingMember?.id) {
                await updateCommitteeMember(editingMember.id, memberData);
            } else {
                await addCommitteeMember(memberData as Omit<Member, 'id'>);
            }
            loadMembers();
        } catch (error) {
            console.error("Failed to save member", error);
            setError("Failed to save the committee member. Please try again.");
        } finally {
            setIsModalOpen(false);
            setEditingMember(null);
        }
    };

    const handleDelete = async (memberId: string) => {
        setError(null);
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                await deleteCommitteeMember(memberId);
                loadMembers();
            } catch (error) {
                console.error("Failed to delete member", error);
                setError("Failed to delete the committee member. Please try again.");
            }
        }
    };

    const openAddModal = () => {
        setError(null);
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const openEditModal = (member: Member) => {
        setError(null);
        setEditingMember(member);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Committee</h1>
                <button onClick={openAddModal} className="btn-primary !py-2">Add New Member</button>
            </div>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            
            {loading ? <p>Loading committee members...</p> : (
                <>
                    {isModalOpen && <MemberForm member={editingMember} onSave={handleSave} onCancel={() => { setIsModalOpen(false); setEditingMember(null); }} />}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                             <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Year</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(member => (
                                    <tr key={member.id} className="border-b">
                                        <td className="p-3 font-semibold">{member.name}</td>
                                        <td className="p-3">{member.role}</td>
                                        <td className="p-3">{member.year}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => openEditModal(member)} className="text-blue-600 hover:underline mr-4">Edit</button>
                                            <button onClick={() => handleDelete(member.id!)} className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageCommittee;
