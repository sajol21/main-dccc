import React, { useEffect, useState } from 'react';
import { Page, Event, Member } from '../types';
import { fetchCollectionWithIds, fetchAndGroupCommitteesByYear } from '../services/dataService';
import MandalaBackground from './MandalaBackground';

// --- Reusable Section Component ---
const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => {
  return (
    <section id={id} className={`container mx-auto px-6 py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
};

// --- New Event Card Component ---
const EventCard: React.FC<{ event: Event; navigateTo: (page: Page) => void }> = ({ event, navigateTo }) => {
  return (
    <div 
      className="group bg-white rounded-xl shadow-subtle transition-all duration-300 hover:shadow-medium hover:-translate-y-2 overflow-hidden flex flex-col"
    >
      <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold font-poppins mb-2 text-dc-dark">{event.title}</h3>
        <p className="text-sm text-dc-text mb-4">{event.date} &bull; {event.venue}</p>
        <a 
          href={`#${Page.Events}`} 
          onClick={(e) => { e.preventDefault(); navigateTo(Page.Events); }}
          className="font-semibold text-dc-blue self-start mt-auto group/link"
        >
          Learn More <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

// --- New Team Member Card Component ---
const TeamMemberCard: React.FC<{ member: Member }> = ({ member }) => {
  return (
    <div className="text-center">
      <img src={member.photoUrl} alt={member.name} className="w-40 h-40 rounded-full mx-auto object-cover shadow-medium" />
      <h3 className="text-dc-dark font-bold text-lg mt-4">{member.name}</h3>
      <p className="text-dc-blue font-semibold text-sm">{member.role}</p>
    </div>
  );
};

const HomePage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [leadership, setLeadership] = useState<Member[]>([]);

  // On-scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const targets = document.querySelectorAll('.scroll-animate');
    targets.forEach(target => observer.observe(target));

    return () => targets.forEach(target => observer.unobserve(target));
  }, [events, leadership]);

  // Data fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        const eventsData = await fetchCollectionWithIds<Event>('events');
        const committeesData = await fetchAndGroupCommitteesByYear();
        
        setEvents(eventsData.filter(e => e.status === 'upcoming').slice(0, 3));

        if (committeesData && committeesData['2024']) {
          setLeadership(committeesData['2024'].slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="pt-16">
      {/* 1. Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 -mt-16 bg-white overflow-hidden">
        <MandalaBackground />
        <div className="z-10 animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-extrabold font-poppins mb-4 tracking-tight text-dc-dark">
            Know Thyself, Show Thyself.
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-dc-text">
             Discover your potential and share your passion with a community that celebrates individuality and expression.
          </p>
          <div className="mt-10">
            <a href={`#${Page.Events}`} onClick={(e) => { e.preventDefault(); navigateTo(Page.Events); }}
               className="btn-primary !px-8">
              Explore Our Events
            </a>
          </div>
        </div>
      </div>

      {/* 2. About Section */}
      <Section className="scroll-animate opacity-0 bg-dc-light">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-dc-dark">The Cultural Heartbeat of Dhaka College</h2>
            <p className="text-dc-text leading-relaxed mb-6">
              For over a decade, we have been the premier platform for students to explore their artistic talents, from captivating stage performances to thought-provoking literary works. We are a community dedicated to fostering creativity and keeping the cultural flame alive.
            </p>
            <a href={`#${Page.About}`} onClick={(e) => { e.preventDefault(); navigateTo(Page.About); }}
               className="btn-outline !py-2">
              Our Story
            </a>
          </div>
          <div>
            <img src="https://picsum.photos/seed/about-home/800/600" alt="Club activity" className="rounded-xl shadow-medium" />
          </div>
        </div>
      </Section>

      {/* 3. Events Highlight */}
      <Section className="scroll-animate opacity-0 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins text-dc-dark">Upcoming Events</h2>
          <p className="text-dc-text mt-2 max-w-xl mx-auto">Join us for our next showcase of talent and creativity.</p>
        </div>
        {events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => <EventCard key={event.id} event={event} navigateTo={navigateTo} />)}
          </div>
        ) : (
          <p className="text-center text-dc-text">No upcoming events scheduled. Please check back soon!</p>
        )}
      </section>

      {/* 4. Team Preview */}
      <Section className="scroll-animate opacity-0 bg-dc-light">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins text-dc-dark">Meet the Leadership</h2>
          <p className="text-dc-text mt-2 max-w-xl mx-auto">The dedicated students leading our cultural movement.</p>
        </div>
        {leadership.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadership.map(member => <TeamMemberCard key={member.name} member={member} />)}
          </div>
        ) : (
          <p className="text-center text-dc-text">Leadership information is currently being updated.</p>
        )}
         <div className="text-center mt-12">
            <a href={`#${Page.Committee}`} onClick={(e) => { e.preventDefault(); navigateTo(Page.Committee); }} 
               className="btn-outline !py-2">
                Meet the Full Team
            </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;