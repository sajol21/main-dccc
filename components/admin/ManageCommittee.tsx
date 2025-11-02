import React, { useState, useEffect } from 'react';
import { Member } from '../../types';
import { fetchCollectionWithIds, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember } from '../../services/dataService';

const MemberForm: React.FC<{
    member: Partial<Member> | null;
    onSave: (memberData: Partial<Member>) => void;
    onCancel: () => void;
}> = ({ member, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Member>>(
        member || { name: '', role: '', photoUrl: '', year: new Date().getFullYear(), socials: { facebook: '', linkedin: '' } }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, socials: { ...formData.socials, [e.target.name]: e.target.value } });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">{member?.id ? 'Edit Member' : 'Add New Member'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 border rounded" />
                    <input name="role" value={formData.role} onChange={handleChange} placeholder="Role (e.g., President)" required className="w-full p-2 border rounded" />
                    <input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="Photo URL" required className="w-full p-2 border rounded" />
                    <input name="year" value={formData.year} onChange={handleChange} type="number" placeholder="Committee Year" required className="w-full p-2 border rounded" />
                    <input name="facebook" value={formData.socials?.facebook} onChange={handleSocialChange} placeholder="Facebook URL (optional)" className="w-full p-2 border rounded" />
                    <input name="linkedin" value={formData.socials?.linkedin} onChange={handleSocialChange} placeholder="LinkedIn URL (optional)" className="w-full p-2 border rounded" />
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-dc-blue text-white rounded-lg">Save Member</button>
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

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await fetchCollectionWithIds<Member>('committees');
            setMembers(data.sort((a,b) => (b.year || 0) - (a.year || 0) ));
        } catch (error) {
            console.error("Failed to load members", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleSave = async (memberData: Partial<Member>) => {
        try {
            if (editingMember?.id) {
                await updateCommitteeMember(editingMember.id, memberData);
            } else {
                await addCommitteeMember(memberData as Omit<Member, 'id'>);
            }
            loadMembers();
        } catch (error) {
            console.error("Failed to save member", error);
        } finally {
            setIsModalOpen(false);
            setEditingMember(null);
        }
    };

    const handleDelete = async (memberId: string) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                await deleteCommitteeMember(memberId);
                loadMembers();
            } catch (error) {
                console.error("Failed to delete member", error);
            }
        }
    };

    const openAddModal = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const openEditModal = (member: Member) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    if (loading) return <p>Loading committee members...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Committee</h1>
                <button onClick={openAddModal} className="px-4 py-2 bg-dc-blue text-white rounded-lg">Add New Member</button>
            </div>

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
        </div>
    );
};

export default ManageCommittee;