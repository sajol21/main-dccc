import React, { useState, useEffect } from 'react';
import { Publication } from '../types';
import { fetchCollectionWithIds } from '../services/dataService';

const PublicationModal: React.FC<{ pub: Publication, onClose: () => void }> = ({ pub, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <img src={pub.imageUrl} alt={pub.title} className="w-full h-72 object-cover rounded-t-lg" />
                <div className="p-8">
                    <h2 className="text-3xl font-bold font-poppins text-dc-dark mb-2">{pub.title}</h2>
                    <p className="text-gray-500 mb-4">By {pub.author} • {pub.category}</p>
                    <div className="prose max-w-none text-dc-text">
                        <p>{pub.content || pub.excerpt}</p>
                        {/* Add more content here if available */}
                         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                    </div>
                    <button onClick={onClose} className="mt-6 btn-primary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const PublicationCard: React.FC<{ pub: Publication, onReadMore: (pub: Publication) => void }> = ({ pub, onReadMore }) => (
    <div className="bg-white rounded-xl flex flex-col group transition-all duration-300 hover:shadow-medium hover:-translate-y-2 overflow-hidden shadow-subtle">
        <div className="overflow-hidden">
            <img src={pub.imageUrl} alt={pub.title} loading="lazy" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <span className="text-sm font-semibold text-dc-blue mb-1">{pub.category}</span>
            <h3 className="text-xl font-bold font-poppins text-dc-dark mb-2">{pub.title}</h3>
            <p className="text-dc-text text-sm mb-4 flex-grow">{pub.excerpt}</p>
            <div className="flex justify-between items-center mt-auto">
                <p className="text-gray-500 text-xs">By {pub.author}</p>
                <button onClick={() => onReadMore(pub)} className="font-semibold text-sm text-dc-blue">Read More</button>
            </div>
        </div>
    </div>
);

const PublicationsPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | Publication['category']>('all');
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPub, setSelectedPub] = useState<Publication | null>(null);

    const categories: Publication['category'][] = ['Literature', 'Opinion', 'Culture'];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchCollectionWithIds<Publication>('publications');
                setPublications(data);
            } catch (err) {
                setError('Failed to load publications. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleReadMore = (pub: Publication) => {
        setSelectedPub(pub);
    };

    const featuredPost = publications.find(p => p.isFeatured);
    const filteredPublications = publications.filter(p => !p.isFeatured && (filter === 'all' || p.category === filter));

    return (
        <div className="py-16 pt-32 bg-dc-light">
            {selectedPub && <PublicationModal pub={selectedPub} onClose={() => setSelectedPub(null)} />}
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 animate-fadeInUp">
                    <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Our Publications</h2>
                    <p className="text-dc-text mt-2 max-w-2xl mx-auto">Explore articles, stories, and creative works from the members of our club.</p>
                </div>
                 {loading ? (
                    <div className="text-center py-20"><p>Loading publications...</p></div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : (
                <>
                    {featuredPost && (
                        <section className="mb-16 bg-white rounded-xl overflow-hidden shadow-subtle">
                            <div className="grid md:grid-cols-2 items-center">
                                <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover max-h-96 md:max-h-full" />
                                <div className="p-8 md:p-12">
                                    <span className="text-dc-blue font-bold">Featured Post</span>
                                    <h3 className="text-3xl font-bold font-poppins mt-2 mb-4 text-dc-dark">{featuredPost.title}</h3>
                                    <p className="text-dc-text mb-6">{featuredPost.excerpt}</p>
                                    <button onClick={() => handleReadMore(featuredPost)} className="btn-primary">Read More</button>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="text-center mb-16 bg-white rounded-xl p-12 shadow-subtle">
                        <h3 className="text-2xl font-bold font-poppins text-dc-dark mb-4">"The Cultural Canvas"</h3>
                        <p className="text-dc-text mb-6 max-w-xl mx-auto">Dive into our collection of digital magazines, a tapestry of creativity woven by our members.</p>
                        <a href="#" className="btn-primary !px-8">
                            Download Latest Issue
                        </a>
                    </section>
                    
                    <section>
                        <div className="flex flex-wrap justify-center gap-2 mb-10">
                            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-full ${filter === 'all' ? 'bg-dc-blue text-white shadow-md' : 'bg-white text-dc-text hover:bg-gray-200'}`}>All Articles</button>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-full ${filter === cat ? 'bg-dc-blue text-white shadow-md' : 'bg-white text-dc-text hover:bg-gray-200'}`}>{cat}</button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPublications.map(pub => (
                                <PublicationCard key={pub.id} pub={pub} onReadMore={handleReadMore} />
                            ))}
                        </div>
                    </section>
                </>
                )}
            </div>
        </div>
    );
};

export default PublicationsPage;