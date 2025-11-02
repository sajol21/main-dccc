import React, { useState, useMemo, useEffect } from 'react';
import { Event } from '../types';
import { fetchDataAsArray } from '../services/dataService';

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <div className="bg-white rounded-xl flex flex-col transition-all duration-300 hover:shadow-medium hover:-translate-y-2 overflow-hidden shadow-subtle">
    <img src={event.imageUrl} alt={event.title} loading="lazy" className="w-full h-56 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-dc-blue">{event.date}</span>
        <span className="px-3 py-1 bg-blue-100 text-dc-blue text-xs font-bold rounded-full">{event.category}</span>
      </div>
      <h3 className="text-xl font-bold text-dc-dark mb-2 font-poppins">{event.title}</h3>
      <p className="text-dc-text text-sm mb-4 flex-grow">{event.description}</p>
      {event.status === 'upcoming' && (
        <button className="mt-auto w-full bg-dc-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-300">
          Register Now
        </button>
      )}
       {event.status === 'past' && (
        <button disabled className="mt-auto w-full bg-gray-200 text-gray-500 font-bold py-2 px-4 cursor-not-allowed rounded-lg">
          Event Concluded
        </button>
      )}
    </div>
  </div>
);

const EventsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | Event['category']>('all');
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: Event['category'][] = ['Music', 'Drama', 'Debate', 'Workshop', 'Festival'];

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchDataAsArray<Event>('events');
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

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => event.status === view)
      .filter(event => filter === 'all' || event.category === filter);
  }, [events, filter, view]);

  return (
    <div className="py-16 pt-32 bg-dc-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Club Events</h2>
          <p className="text-dc-text mt-2 max-w-2xl mx-auto">From grand festivals to intimate workshops, discover the heartbeat of our club.</p>
        </div>

        <div className="flex justify-center mb-8 bg-gray-200 rounded-lg p-1 max-w-sm mx-auto">
          <button onClick={() => setView('upcoming')} className={`w-1/2 py-2 font-semibold transition-all rounded-md ${view === 'upcoming' ? 'bg-white shadow-sm text-dc-blue' : 'text-gray-600'}`}>
            Upcoming
          </button>
          <button onClick={() => setView('past')} className={`w-1/2 py-2 font-semibold transition-all rounded-md ${view === 'past' ? 'bg-white shadow-sm text-dc-blue' : 'text-gray-600'}`}>
            Past
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-full ${filter === 'all' ? 'bg-dc-blue text-white' : 'bg-white text-dc-text hover:bg-gray-200'}`}>All</button>
            {categories.map(category => (
                 <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-full ${filter === category ? 'bg-dc-blue text-white' : 'bg-white text-dc-text hover:bg-gray-200'}`}>
                    {category}
                </button>
            ))}
        </div>

        {loading ? (
          <div className="text-center py-20"><p>Loading events...</p></div>
        ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="text-center text-dc-text col-span-full bg-white rounded-xl p-12 shadow-subtle">
                  <p>No events found for this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;