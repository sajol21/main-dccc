import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { fetchAndGroupCommitteesByYear } from '../services/dataService';

// Simple SVG for social icons to avoid repeating SVG code
const SocialIcon: React.FC<{ href: string, icon: 'linkedin' | 'facebook' }> = ({ href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-dc-blue transition-colors">
        {icon === 'linkedin' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-7 5H9v7h2v-7zm-4 0H5v7h2v-7zm8 0h-2v7h2v-7z" /></svg>}
        {icon === 'facebook' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>}
    </a>
)

const LeadershipCard: React.FC<{ member: Member }> = ({ member }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex flex-col items-center p-6 text-center">
             <img className="h-32 w-32 rounded-full object-cover shadow-lg border-4 border-dc-gold" src={member.photoUrl} alt={member.name} loading="lazy" />
             <div className="mt-4">
                <h3 className="text-xl leading-tight font-bold font-poppins text-dc-dark">{member.name}</h3>
                <p className="mt-1 text-dc-blue font-semibold">{member.role}</p>
                <div className="mt-4 flex justify-center space-x-3">
                    {member.socials.facebook && <SocialIcon href={member.socials.facebook} icon="facebook" />}
                    {member.socials.linkedin && <SocialIcon href={member.socials.linkedin} icon="linkedin" />}
                </div>
            </div>
        </div>
    </div>
);

const GeneralMemberCard: React.FC<{ member: Member }> = ({ member }) => (
    <div className="group bg-white rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-6 border">
        <img src={member.photoUrl} alt={member.name} loading="lazy" className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-dc-gray group-hover:border-dc-blue transition-colors" />
        <div className="mt-3">
            <h3 className="text-lg font-bold font-poppins text-dc-dark">{member.name}</h3>
            <p className="text-sm text-dc-text">{member.role}</p>
             <div className="mt-3 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {member.socials.facebook && <SocialIcon href={member.socials.facebook} icon="facebook" />}
                {member.socials.linkedin && <SocialIcon href={member.socials.linkedin} icon="linkedin" />}
            </div>
        </div>
    </div>
);


const CommitteePage: React.FC = () => {
  const [committees, setCommittees] = useState<{ [year: string]: Member[] }>({});
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [openYear, setOpenYear] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAndGroupCommitteesByYear();
            if (data && Object.keys(data).length > 0) {
                const years = Object.keys(data).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
                setAvailableYears(years);
                setCommittees(data);
                setOpenYear(years[0]); // Open the latest year by default
            } else {
                 setCommittees({});
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

  const leadershipRoles = ['President', 'Vice President', 'General Secretary'];

  return (
    <div className="py-16 pt-32 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Our Executive Committees</h2>
          <p className="text-dc-text mt-2 max-w-2xl mx-auto">Meet the dedicated students leading our cultural movement across the years.</p>
        </div>

        {loading ? (
             <div className="text-center py-20"><p>Loading members...</p></div>
        ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
            <div className="space-y-4 max-w-5xl mx-auto">
                {availableYears.map(year => {
                    const members = committees[year] || [];
                    const leadership = members.filter(m => leadershipRoles.includes(m.role));
                    const generalMembers = members.filter(m => !leadershipRoles.includes(m.role));
                    const isOpen = openYear === year;

                    return (
                        <div key={year} className="border bg-white rounded-xl shadow-sm overflow-hidden">
                            <button
                                onClick={() => setOpenYear(isOpen ? '' : year)}
                                className="w-full flex justify-between items-center p-5 text-left transition-colors hover:bg-gray-50"
                                aria-expanded={isOpen}
                                aria-controls={`committee-${year}`}
                            >
                                <h3 className="text-xl font-bold font-poppins text-dc-blue">Committee of {year}</h3>
                                <svg className={`w-6 h-6 text-dc-blue transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div id={`committee-${year}`} className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="p-6 bg-gray-50 space-y-12">
                                        {/* Leadership Section */}
                                        {leadership.length > 0 && (
                                            <div>
                                                <h4 className="text-2xl font-semibold font-poppins text-dc-dark mb-6 text-center">Leadership</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    {leadership.map(member => <LeadershipCard key={member.id || member.name} member={member} />)}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* General Members Section */}
                                        {generalMembers.length > 0 && (
                                            <div>
                                                <h4 className="text-2xl font-semibold font-poppins text-dc-dark mb-6 text-center">Committee Members</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                     {generalMembers.map(member => <GeneralMemberCard key={member.id || member.name} member={member} />)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        
        <div className="mt-20 bg-white rounded-xl p-8 md:p-12 shadow-sm text-center border">
            <h2 className="text-3xl font-bold font-poppins text-dc-dark">Our Creative Wings</h2>
            <p className="text-dc-text mt-2 max-w-2xl mx-auto">The dedicated teams focusing on specific cultural domains that bring our events to life.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
                {['Drama', 'Music', 'Literature', 'Photography', 'Debate', 'Arts'].map(team => (
                     <span key={team} className="bg-blue-100 text-dc-blue px-4 py-2 text-sm font-semibold rounded-full">
                        {team} Wing
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteePage;