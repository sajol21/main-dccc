import React, { useState, useEffect, useMemo } from 'react';
import { GalleryItem } from '../types';
import { fetchCollectionWithIds } from '../services/dataService';

const GalleryCard: React.FC<{ item: GalleryItem }> = ({ item }) => {
  if (item.type === 'video') {
    // Basic validation for YouTube embed URLs
    const videoId = item.url.includes('embed/') ? item.url.split('embed/')[1].split('?')[0] : null;
    if (!videoId) return <p>Invalid video URL</p>;

    return (
      <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
           <iframe 
                src={`https://www.youtube.com/embed/${videoId}`}
                title={item.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-dc-dark">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.event} - {item.year}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-subtle overflow-hidden group">
      <img src={item.url} alt={item.title} loading="lazy" className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="p-4">
        <h3 className="font-bold text-dc-dark">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.event} - {item.year}</p>
      </div>
    </div>
  );
};

const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCollectionWithIds<GalleryItem>('galleryItems');
        setItems(data.sort((a, b) => b.year - a.year));
      } catch (err) {
        setError('Failed to load gallery items. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(item => item.type === filter);
  }, [items, filter]);

  return (
    <div className="py-16 pt-32 bg-dc-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Our Gallery</h2>
          <p className="text-dc-text mt-2 max-w-2xl mx-auto">A visual journey through our most memorable moments.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          <button onClick={() => setFilter('all')} className={`px-5 py-2 font-semibold rounded-full transition-colors ${filter === 'all' ? 'bg-dc-blue text-white' : 'bg-white text-dc-text'}`}>All</button>
          <button onClick={() => setFilter('photo')} className={`px-5 py-2 font-semibold rounded-full transition-colors ${filter === 'photo' ? 'bg-dc-blue text-white' : 'bg-white text-dc-text'}`}>Photos</button>
          <button onClick={() => setFilter('video')} className={`px-5 py-2 font-semibold rounded-full transition-colors ${filter === 'video' ? 'bg-dc-blue text-white' : 'bg-white text-dc-text'}`}>Videos</button>
        </div>

        {loading ? (
          <div className="text-center py-20"><p>Loading gallery...</p></div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => <GalleryCard key={item.id} item={item} />)
            ) : (
              <p className="col-span-full text-center text-dc-text">No items found for this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;