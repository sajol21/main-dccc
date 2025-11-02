import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { fetchDataAsObject } from '../services/dataService';

const MemberCard: React.FC<{ member: Member }> = ({ member }) => (
  <div className="bg-white text-center transition-all duration-300 hover:shadow-medium hover:-translate-y-2 rounded-xl overflow-hidden shadow-subtle">
    <img src={member.photoUrl} alt={member.name} loading="lazy" className="w-full h-64 object-cover" />
    <div className="p-5">
      <h3 className="text-xl font-bold text-dc-dark">{member.name}</h3>
      <p className="text-dc-blue font-semibold">{member.role}</p>
      <div className="mt-4 flex justify-center space-x-4">
        {member.socials.facebook && <a href={member.socials.facebook} className="text-gray-400 hover:text-dc-blue"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>}
        {member.socials.linkedin && <a href={member.socials.linkedin} className="text-gray-400 hover:text-dc-blue"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-7 5H9v7h2v-7zm-4 0H5v7h2v-7zm8 0h-2v7h2v-7z" /></svg></a>}
      </div>
    </div>
  </div>
);

const CommitteePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'2024' | '2023'>('2024');
  const [committees, setCommittees] = useState<{ '2024': Member[], '2023': Member[] }>({ '2024': [], '2023': [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchDataAsObject<{ [year: string]: { [key: string]: Member } }>('committees');
            if (data) {
                const formattedData = {
                    '2024': data['2024'] ? Object.values(data['2024']) : [],
                    '2023': data['2023'] ? Object.values(data['2023']) : [],
                };
                setCommittees(formattedData);
            } else {
                 setCommittees({ '2024': [], '2023': [] });
            }
        } catch (err) {
            setError('Failed to load committee data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  return (
    <div className="py-16 pt-32 bg-dc-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Our Team</h2>
          <p className="text-dc-text mt-2 max-w-2xl mx-auto">Meet the dedicated individuals who lead our club with passion and vision.</p>
        </div>

        <div className="flex justify-center mb-10 border-b border-dc-gray">
          <button
            onClick={() => setActiveTab('2024')}
            className={`px-6 py-3 font-semibold text-lg transition-colors duration-300 border-b-4 ${activeTab === '2024' ? 'border-dc-blue text-dc-dark' : 'border-transparent text-gray-500 hover:text-dc-dark'}`}
          >
            Committee 2024
          </button>
          <button
            onClick={() => setActiveTab('2023')}
            className={`px-6 py-3 font-semibold text-lg transition-colors duration-300 border-b-4 ${activeTab === '2023' ? 'border-dc-blue text-dc-dark' : 'border-transparent text-gray-500 hover:text-dc-dark'}`}
          >
            Committee 2023
          </button>
        </div>

        {loading ? (
             <div className="text-center py-20"><p>Loading members...</p></div>
        ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {committees[activeTab].map((member, index) => (
                    <MemberCard key={index} member={member} />
                ))}
            </div>
        )}
        
        <div className="mt-20 bg-white rounded-xl p-8 md:p-12 shadow-subtle">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-poppins text-dc-dark">Special Teams</h2>
                <p className="text-dc-text mt-2 max-w-2xl mx-auto">The creative forces behind our diverse range of activities.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {['Drama', 'Music', 'Literature', 'Photography', 'Debate', 'Arts'].map(team => (
                     <span key={team} className="bg-gray-100 text-dc-text px-6 py-3 font-semibold border border-dc-gray rounded-lg">
                        {team} Team
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteePage;