import React, { useState, useMemo, useEffect } from 'react';
import { GalleryItem } from '../types';
import { fetchDataAsArray } from '../services/dataService';

const GalleryPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
    const [yearFilter, setYearFilter] = useState<'all' | number>('all');
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDataAsArray<GalleryItem>('galleryItems');
                setGalleryItems(data);
            } catch (err) {
                setError('Failed to load gallery items. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    
    const years = useMemo(() => ['all', ...Array.from(new Set(galleryItems.map(item => item.year))).sort((a, b) => b - a)], [galleryItems]);

    const filteredItems = useMemo(() => {
        return galleryItems
            .filter(item => filter === 'all' || item.type === filter)
            .filter(item => yearFilter === 'all' || item.year === yearFilter);
    }, [galleryItems, filter, yearFilter]);

    return (
        <div className="py-16 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-poppins text-dc-blue">Gallery & Media</h2>
                    <p className="text-slate-600 mt-2 max-w-2xl mx-auto">A visual journey through our most memorable moments and achievements.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Type:</span>
                        <select onChange={(e) => setFilter(e.target.value as any)} value={filter} className="p-2 rounded-md border-slate-300 shadow-sm">
                            <option value="all">All</option>
                            <option value="photo">Photos</option>
                            <option value="video">Videos</option>
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Year:</span>
                        <select onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} value={yearFilter} className="p-2 rounded-md border-slate-300 shadow-sm">
                           {years.map(year => <option key={year} value={year}>{year === 'all' ? 'All Years' : year}</option>)}
                        </select>
                    </div>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="text-center py-20"><p>Loading gallery...</p></div>
                ) : error ? (
                    <div className="text-center py-20 text-red-600">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                                    {item.type === 'photo' ? (
                                        <>
                                            <img src={item.url} alt={item.title} loading="lazy" className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                                            <div className="p-4">
                                                <h3 className="font-bold text-dc-blue">{item.title}</h3>
                                                <p className="text-sm text-slate-500">{item.event} - {item.year}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="aspect-w-16 aspect-h-9">
                                                <iframe src={item.url} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-dc-blue">{item.title}</h3>
                                                <p className="text-sm text-slate-500">{item.event} - {item.year}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        {filteredItems.length === 0 && (
                            <p className="text-center text-slate-500 col-span-full mt-8">No items match the current filters.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default GalleryPage;