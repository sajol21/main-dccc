import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { fetchCollectionWithIds, addEvent, updateEvent, deleteEvent } from '../../services/dataService';

const EventForm: React.FC<{
    event: Partial<Event> | null;
    onSave: (eventData: Partial<Event>) => void;
    onCancel: () => void;
}> = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Event>>(
        event || { title: '', date: '', venue: '', description: '', imageUrl: '', category: 'Workshop', status: 'upcoming' }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">{event?.id ? 'Edit Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
                    <input name="date" value={formData.date} onChange={handleChange} placeholder="Date (e.g., 25 DEC 2024)" required />
                    <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="h-24" />
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required />
                    <div className="flex gap-4">
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="Music">Music</option>
                            <option value="Drama">Drama</option>
                            <option value="Debate">Debate</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Festival">Festival</option>
                        </select>
                        <select name="status" value={formData.status} onChange={handleChange} required>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onCancel} className="btn-secondary !py-2">Cancel</button>
                        <button type="submit" className="btn-primary !py-2">Save Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await fetchCollectionWithIds<Event>('events');
            setEvents(data);
        } catch (error) {
            console.error("Failed to load events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleSave = async (eventData: Partial<Event>) => {
        try {
            if (editingEvent?.id) {
                await updateEvent(editingEvent.id, eventData);
            } else {
                await addEvent(eventData as Omit<Event, 'id'>);
            }
            loadEvents();
        } catch (error) {
            console.error("Failed to save event", error);
        } finally {
            setIsModalOpen(false);
            setEditingEvent(null);
        }
    };

    const handleDelete = async (eventId: string) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent(eventId);
                loadEvents();
            } catch (error) {
                console.error("Failed to delete event", error);
            }
        }
    };

    const openAddModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    if (loading) return <p>Loading events...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Events</h1>
                <button onClick={openAddModal} className="btn-primary !py-2">Add New Event</button>
            </div>

            {isModalOpen && <EventForm event={editingEvent} onSave={handleSave} onCancel={() => { setIsModalOpen(false); setEditingEvent(null); }} />}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3">Title</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} className="border-b">
                                <td className="p-3 font-semibold">{event.title}</td>
                                <td className="p-3">{event.date}</td>
                                <td className="p-3">{event.category}</td>
                                <td className="p-3">{event.status}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => openEditModal(event)} className="text-blue-600 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(event.id!)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageEvents;