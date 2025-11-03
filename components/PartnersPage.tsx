import React, { useState, useEffect, useMemo } from 'react';
import { Partner } from '../types';
import { fetchCollectionWithIds } from '../services/dataService';

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => (
  <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-subtle transition-transform duration-300 hover:-translate-y-2">
    <img src={partner.logoUrl} alt={`${partner.name} logo`} className="h-20 mb-4 object-contain" />
    <h3 className="text-lg font-bold text-dc-dark">{partner.name}</h3>
    <p className="text-sm text-dc-text mt-2 flex-grow">{partner.description}</p>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-16">
    <h2 className="text-3xl font-bold font-poppins text-dc-blue text-center mb-8">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {children}
    </div>
  </section>
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
        const data = await fetchCollectionWithIds<Partner>('partners');
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

  const groupedPartners = useMemo(() => {
    return partners.reduce((acc, partner) => {
      const type = partner.type || 'sponsor';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(partner);
      return acc;
    }, {} as Record<Partner['type'], Partner[]>);
  }, [partners]);

  return (
    <div className="py-16 pt-32 bg-dc-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Our Partners & Sponsors</h2>
          <p className="text-dc-text mt-2 max-w-2xl mx-auto">
            We are grateful for the generous support of our partners who help us bring our cultural vision to life.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20"><p>Loading partners...</p></div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div>
            {groupedPartners.institutional && (
              <Section title="Institutional Support">
                {groupedPartners.institutional.map(p => <PartnerCard key={p.id} partner={p} />)}
              </Section>
            )}
            {groupedPartners.sponsor && (
              <Section title="Official Sponsors">
                {groupedPartners.sponsor.map(p => <PartnerCard key={p.id} partner={p} />)}
              </Section>
            )}
            {groupedPartners.media && (
              <Section title="Media Partners">
                {groupedPartners.media.map(p => <PartnerCard key={p.id} partner={p} />)}
              </Section>
            )}
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl p-8 text-center shadow-medium">
            <h3 className="text-2xl font-bold font-poppins text-dc-dark">Become a Partner</h3>
            <p className="text-dc-text mt-2 mb-6 max-w-xl mx-auto">Support the next generation of artists and leaders. Partner with us to make a lasting impact on the cultural fabric of our community.</p>
            <a href="#contact" className="btn-primary !px-8">
                Contact Us for Partnership
            </a>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;