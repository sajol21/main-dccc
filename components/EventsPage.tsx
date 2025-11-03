import React, { useState, useMemo, useEffect } from 'react';
import { Event } from '../types';
import { fetchCollectionWithIds } from '../services/dataService';

const EventCard: React.FC<{ event: Event; onRegister: (event: Event) => void; }> = ({ event, onRegister }) => (
  <div className="bg-white rounded-xl flex flex-col transition-all duration-300 overflow-hidden border-2 border-dc-dark shadow-neo hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#111827]">
    <img src={event.imageUrl} alt={event.title} loading="lazy" className="w-full h-56 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-dc-blue">{event.date}</span>
        <span className="px-3 py-1 bg-dc-yellow text-dc-dark text-xs font-bold rounded-full border border-dc-dark">{event.category}</span>
      </div>
      <h3 className="text-xl font-bold text-dc-dark mb-2 font-poppins">{event.title}</h3>
      <p className="text-dc-text text-sm mb-4 flex-grow">{event.description}</p>
      {event.status === 'upcoming' && (
        <button onClick={() => onRegister(event)} className="btn-primary w-full mt-auto !py-2">
          Register Now
        </button>
      )}
       {event.status === 'past' && (
        <button disabled className="mt-auto w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 cursor-not-allowed rounded-lg border-2 border-dc-dark shadow-neo-sm">
          Event Concluded
        </button>
      )}
    </div>
  </div>
);

const RegistrationModal: React.FC<{ event: Event; onClose: () => void }> = ({ event, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center border-2 border-dc-dark shadow-neo">
                <h2 className="text-2xl font-bold mb-4 text-dc-dark">Confirm Registration</h2>
                <p className="text-dc-text mb-6">You are registering for the event: <strong className="text-dc-blue">{event.title}</strong>. A confirmation will be sent to your registered email.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onClose} className="btn-primary">Confirm</button>
                </div>
            </div>
        </div>
    );
};

const EventsPage: React.FC = () => {
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCollectionWithIds<Event>('events');
            setEvents(data);
        } catch (err) {
            setError('Failed to load events. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);
  
  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => event.status === view);
  }, [events, view]);

  return (
    <div className="py-16 pt-32 bg-dc-light">
      {isModalOpen && selectedEvent && <RegistrationModal event={selectedEvent} onClose={() => setIsModalOpen(false)} />}
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Club Events</h2>
          <p className="text-dc-text mt-2 max-w-2xl mx-auto">From grand festivals to intimate workshops, discover the heartbeat of our club.</p>
        </div>

        <div className="flex justify-center mb-8 bg-gray-200 rounded-lg p-1 max-w-sm mx-auto border-2 border-dc-dark shadow-neo-sm">
          <button onClick={() => setView('upcoming')} className={`w-1/2 py-2 font-semibold transition-all rounded-md text-dc-dark ${view === 'upcoming' ? 'bg-dc-yellow shadow-neo-sm border-2 border-dc-dark' : 'text-gray-600'}`}>
            Upcoming
          </button>
          <button onClick={() => setView('past')} className={`w-1/2 py-2 font-semibold transition-all rounded-md text-dc-dark ${view === 'past' ? 'bg-dc-yellow shadow-neo-sm border-2 border-dc-dark' : 'text-gray-600'}`}>
            Past
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-20"><p>Loading events...</p></div>
        ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => <EventCard key={event.id} event={event} onRegister={handleRegisterClick} />)
            ) : (
              <div className="text-center text-dc-text col-span-full bg-white rounded-xl p-12 border-2 border-dc-dark shadow-neo">
                  <p>No {view} events found at the moment. Please check back later!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;