import React, { useState, useEffect } from 'react';
import { ContactMessage } from '../../types';
import { fetchMessages } from '../../services/dataService';

const ViewMessages: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMessages = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchMessages();
                setMessages(data);
            } catch (err) {
                console.error("Failed to load messages", err);
                setError("Could not load messages. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, []);

    if (loading) return <p>Loading messages...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Contact Form Messages</h1>
            {messages.length === 0 ? (
                <p>No messages have been received yet.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-dc-dark">{msg.name} <span className="font-normal text-gray-500">&lt;{msg.email}&gt;</span></p>
                                <p className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="text-dc-text">{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewMessages;