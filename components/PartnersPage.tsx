import React, { useState, useEffect } from 'react';
import { Partner } from '../types';
import { fetchDataAsArray } from '../services/dataService';

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 bg-slate-100 p-4 rounded-md">
            <img src={partner.logoUrl} alt={`${partner.name} logo`} loading="lazy" className="h-16 object-contain w-32" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-dc-blue">{partner.name}</h3>
            <p className="text-slate-600 mt-1">{partner.description}</p>
        </div>
    </div>
);

const PartnersPage: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDataAsArray<Partner>('partners');
                setPartners(data);
            } catch (err) {
                setError('Failed to load partners data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const institutional = partners.filter(p => p.type === 'institutional');
    const sponsors = partners.filter(p => p.type === 'sponsor');
    const media = partners.filter(p => p.type === 'media');

    return (
        <div className="py-16 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-poppins text-dc-blue">Partners & Sponsors</h2>
                    <p className="text-slate-600 mt-2 max-w-2xl mx-auto">We are grateful for the support of our partners who help us bring our vision to life.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20"><p>Loading partners...</p></div>
                ) : error ? (
                    <div className="text-center py-20 text-red-600">{error}</div>
                ) : (
                <>
                    <section className="mb-12">
                        <h3 className="text-2xl font-bold font-poppins text-dc-blue mb-6 border-b-2 border-dc-gold pb-2">Institutional Support</h3>
                        <div className="space-y-6">
                            {institutional.map(p => <PartnerCard key={p.name} partner={p} />)}
                        </div>
                    </section>

                    <section className="mb-12">
                        <h3 className="text-2xl font-bold font-poppins text-dc-blue mb-6 border-b-2 border-dc-gold pb-2">Our Sponsors</h3>
                        <div className="space-y-6">
                            {sponsors.map(p => <PartnerCard key={p.name} partner={p} />)}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold font-poppins text-dc-blue mb-6 border-b-2 border-dc-gold pb-2">Media Partners</h3>
                        <div className="space-y-6">
                            {media.map(p => <PartnerCard key={p.name} partner={p} />)}
                        </div>
                    </section>
                </>
                )}
            </div>
        </div>
    );
};

export default PartnersPage;