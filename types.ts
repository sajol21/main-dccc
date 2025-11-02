export enum Page {
  Home = 'home',
  About = 'about',
  Committee = 'committee',
  Events = 'events',
  Publications = 'publications',
  Join = 'join',
  Contact = 'contact',
  Login = 'login',
  Register = 'register',
  Portal = 'portal',
  Admin = 'admin',
}

export interface Member {
  id?: string;
  name: string;
  role: string;
  photoUrl: string;
  year?: number;
  socials: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface Advisor {
    name: string;
    designation: string;
    photoUrl: string;
}

export interface Event {
  id?: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  imageUrl: string;
  category: 'Music' | 'Drama' | 'Debate' | 'Workshop' | 'Festival';
  status: 'upcoming' | 'past';
}

export interface Publication {
    id?: string;
    title: string;
    author: string;
    category: 'Literature' | 'Opinion' | 'Culture';
    imageUrl: string;
    excerpt: string;
    isFeatured?: boolean;
    content?: string; // Enhanced for modal view
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

// FIX: Added GalleryItem interface for use in GalleryPage.tsx.
export interface GalleryItem {
  id?: string;
  title: string;
  type: 'photo' | 'video';
  url: string;
  event: string;
  year: number;
}

// FIX: Added Partner interface for use in PartnersPage.tsx.
export interface Partner {
  id?: string;
  name: string;
  logoUrl: string;
  description: string;
  type: 'institutional' | 'sponsor' | 'media';
}
