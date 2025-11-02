export enum Page {
  Home = 'home',
  About = 'about',
  Committee = 'committee',
  Events = 'events',
  Publications = 'publications',
  Contact = 'contact',
  Login = 'login',
  Register = 'register',
  Portal = 'portal',
  Admin = 'admin',
}

export interface Member {
  name: string;
  role: string;
  photoUrl: string;
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
  id: number;
  title: string;
  date: string;
  venue: string;
  description: string;
  imageUrl: string;
  category: 'Music' | 'Drama' | 'Debate' | 'Workshop' | 'Festival';
  status: 'upcoming' | 'past';
}

export interface Publication {
    id: number;
    title: string;
    author: string;
    category: 'Literature' | 'Opinion' | 'Culture';
    imageUrl: string;
    excerpt: string;
    isFeatured?: boolean;
}

// FIX: Add GalleryItem type definition for use in GalleryPage.tsx. This resolves import errors and subsequent type inference issues.
export interface GalleryItem {
  id: number;
  title: string;
  event: string;
  year: number;
  type: 'photo' | 'video';
  url: string;
}

// FIX: Add Partner type definition for use in PartnersPage.tsx.
export interface Partner {
  name: string;
  description: string;
  logoUrl: string;
  type: 'institutional' | 'sponsor' | 'media';
}