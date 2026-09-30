export interface MembershipPlan {
  id: string;
  duration: string;
  cardioPrice: number;
  nonCardioPrice: number;
  cardioFeatures: string[];
  nonCardioFeatures: string[];
  isPopular?: boolean;
  badge?: string;
  active: boolean;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  category: string;
  active: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  planId?: string;
  planTitle?: string;
  planType?: 'cardio' | 'nonCardio';
  goal?: string;
  status: 'new' | 'contacted' | 'enrolled';
  notes?: string;
  createdAt: string;
}

export interface SiteContent {
  brandName: string;
  brandTagline: string;
  locationCity: string;
  heroHeadline: string;
  heroSubhead: string;
  heroBadge: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  mentor: {
    name: string;
    honorific: string;
    award: string;
    bio: string;
    portraitImage: string;
    awardImage: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    whatsapp: string;
    address: string;
    hoursWeekday: string;
    hoursSunday: string;
    ladiesHours: string;
    googleMapsEmbed: string;
    googleMapsUrl: string;
  };
  rules: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  quickStats: Array<{
    number: string;
    title: string;
    description: string;
  }>;
}

export interface AppData {
  memberships: MembershipPlan[];
  facilities: Facility[];
  gallery: GalleryItem[];
  content: SiteContent;
  leads: Lead[];
  lastPriceUpdate: string;
}
