import React, { useState, useEffect } from 'react';
import { fetchDataAsArray, fetchAndGroupCommitteesByYear } from '../services/dataService';
import { Advisor, Member } from '../types';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-bold font-poppins text-dc-blue text-center mb-12">{children}</h2>
);

const InfoCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl p-8 md:p-12 shadow-subtle ${className}`}>
        {children}
    </div>
);

const AboutPage: React.FC = () => {
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [president, setPresident] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const advisorsData = await fetchDataAsArray<Advisor>('advisors');
                const committeesData = await fetchAndGroupCommitteesByYear();
                
                setAdvisors(advisorsData || []);

                if (committeesData && committeesData['2024']) {
                    const committee2024 = committeesData['2024'];
                    const pres = committee2024.find(m => m.role === 'President');
                    setPresident(pres || null);
                }

            } catch (err) {
                setError('Failed to load page data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-xl">Loading About Us...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-xl text-red-500">{error}</p></div>;
    }

  return (
    <div className="py-16 pt-32 bg-dc-light">
      <div className="container mx-auto px-6 space-y-12">
        
        <InfoCard>
          <SectionTitle>Our Story</SectionTitle>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img src="https://picsum.photos/seed/history/800/600" alt="Dhaka College Campus" loading="lazy" className="rounded-lg"/>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-dc-dark mb-4">A Legacy of Culture at Dhaka College</h3>
              <p className="text-dc-text leading-relaxed">
                Founded with the vision to create a cultural hub within the historic Dhaka College, our club has been a cornerstone of artistic and intellectual expression for decades. From humble beginnings with a handful of passionate students, we have grown into a thriving community that organizes some of the most anticipated events on campus. Our journey is one of passion, dedication, and the relentless pursuit of creativity. We honor our past while continuously innovating for the future, ensuring the cultural flame of Dhaka College burns brighter than ever.
              </p>
            </div>
          </div>
        </InfoCard>

        <InfoCard>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-dc-blue mb-4">Our Mission</h3>
              <p className="text-dc-text leading-relaxed">To provide a dynamic and inclusive platform for all students of Dhaka College to explore, express, and celebrate their creative talents, fostering a vibrant cultural atmosphere on campus.</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-dc-blue mb-4">Our Vision</h3>
              <p className="text-dc-text leading-relaxed">To be recognized as a leading collegiate cultural organization, nurturing future leaders and artists who champion cultural heritage and creative innovation in society.</p>
            </div>
          </div>
        </InfoCard>

        <InfoCard>
          <SectionTitle>Our Guiding Light: Faculty Advisors</SectionTitle>
          <div className="flex flex-wrap justify-center gap-8">
            {advisors.map((advisor, index) => (
              <div key={index} className="text-center w-64">
                <img src={advisor.photoUrl} alt={advisor.name} loading="lazy" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md"/>
                <h4 className="font-bold text-lg text-dc-dark">{advisor.name}</h4>
                <p className="text-dc-text">{advisor.designation}</p>
              </div>
            ))}
          </div>
        </InfoCard>

        {president && (
          <InfoCard>
            <div className="flex flex-col md:flex-row items-center gap-8">
                <img src={president.photoUrl} alt="Club President" loading="lazy" className="w-40 h-40 rounded-full border-4 border-white shadow-md flex-shrink-0"/>
                <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold font-poppins text-dc-blue mb-2">A Message from the President</h3>
                      <blockquote className="italic text-lg text-dc-text">
                          "Welcome to our cultural family! Here, we don't just organize events; we create experiences and build lifelong bonds. I invite each of you to join us, share your passion, and be a part of our ever-growing legacy."
                      </blockquote>
                      <p className="text-right mt-4 font-semibold text-dc-blue">- {president.name}, President</p>
                </div>
            </div>
          </InfoCard>
        )}
        
        <InfoCard>
          <SectionTitle>Milestones & Achievements</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h4 className="text-dc-blue text-4xl font-bold mb-2">10+</h4>
              <p className="text-dc-text font-semibold">Years of Cultural Excellence</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h4 className="text-dc-blue text-4xl font-bold mb-2">50+</h4>
              <p className="text-dc-text font-semibold">Major Events Organized</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h4 className="text-dc-blue text-4xl font-bold mb-2">5+</h4>
              <p className="text-dc-text font-semibold">National Level Awards</p>
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default AboutPage;