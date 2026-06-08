// Database types and mock data for Ebenezar Digital Admin

export type UserRole = "admin" | "editor";

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "digital" | "travel" | "web" | "other";
  features: string[];
  processSteps?: string[];
  pricing?: {
    basic?: number;
    standard?: number;
    premium?: number;
  };
  status: "published" | "draft";
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  category: string[];
  description: string;
  challenge?: string;
  solution?: string;
  result?: string;
  coverImage: string;
  galleryImages: string[];
  techStack: string[];
  liveUrl?: string;
  status: "published" | "draft";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
  status: "new" | "in-progress" | "replied" | "closed" | "spam";
  notes?: string;
  repliedAt?: Date;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  status: "published" | "hidden";
  order: number;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  order: number;
  createdAt: Date;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  ogImage?: string;
  smtpSettings?: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
}

// Mock data
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@ebenezar.com",
    password: "$2b$10$YourHashedPasswordHere", // "admin123"
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
];

export const mockServices: Service[] = [
  {
    id: "1",
    title: "Data Entry",
    description: "Accurate, timely data entry from forms, spreadsheets, or documents.",
    icon: "FileText",
    category: "digital",
    features: ["Fast turnaround", "99% accuracy", "Multiple formats", "Confidential"],
    status: "published",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Web Development",
    description: "Custom websites built with modern technologies.",
    icon: "Globe",
    category: "web",
    features: ["Responsive design", "SEO optimized", "Fast loading", "Secure"],
    status: "published",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Travel Booking",
    description: "End-to-end travel assistance for business and personal trips.",
    icon: "Plane",
    category: "travel",
    features: ["Flight booking", "Hotel reservations", "Itinerary planning", "24/7 support"],
    status: "published",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "E-Commerce Migration",
    clientName: "Retail Co",
    category: ["data"],
    description: "Migrated 2000+ products to new platform.",
    coverImage: "/images/work-1.jpg",
    galleryImages: [],
    techStack: ["Excel", "CSV", "SQL"],
    status: "published",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockInquiries: Inquiry[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    service: "web",
    message: "Need a website for my restaurant.",
    status: "new",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    service: "data",
    message: "Looking for data entry assistance for Q4 reports.",
    status: "in-progress",
    createdAt: new Date(Date.now() - 86400000),
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    role: "CEO",
    company: "TravelWise Agency",
    content: "Excellent service and support!",
    rating: 5,
    status: "published",
    order: 1,
    createdAt: new Date(),
  },
];

// In-memory storage (replace with real database in production)
class Database {
  users: User[] = [...mockUsers];
  services: Service[] = [...mockServices];
  portfolio: PortfolioItem[] = [...mockPortfolio];
  inquiries: Inquiry[] = [...mockInquiries];
  testimonials: Testimonial[] = [...mockTestimonials];
  blogPosts: BlogPost[] = [];
  team: TeamMember[] = [];
  settings: SiteSettings = {
    siteName: "Ebenezar Digital Services",
    siteDescription: "Reliable digital work for businesses everywhere.",
    contactEmail: "contact@ebenezar.com",
    socialLinks: {},
  };

  // User methods
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  // Inquiry methods
  async getInquiries(): Promise<Inquiry[]> {
    return this.inquiries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getInquiryById(id: string): Promise<Inquiry | undefined> {
    return this.inquiries.find((i) => i.id === id);
  }

  async updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return undefined;
    this.inquiries[index] = { ...this.inquiries[index], ...data };
    return this.inquiries[index];
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.inquiries.splice(index, 1);
    return true;
  }

  // Stats
  async getStats() {
    const totalInquiries = this.inquiries.length;
    const newInquiries = this.inquiries.filter((i) => i.status === "new").length;
    const pendingReplies = this.inquiries.filter((i) => i.status === "in-progress").length;
    const thisMonth = this.inquiries.filter((i) => {
      const now = new Date();
      return i.createdAt.getMonth() === now.getMonth() && i.createdAt.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalInquiries,
      newInquiries,
      pendingReplies,
      thisMonth,
      publishedServices: this.services.filter((s) => s.status === "published").length,
      publishedPortfolio: this.portfolio.filter((p) => p.status === "published").length,
      publishedTestimonials: this.testimonials.filter((t) => t.status === "published").length,
    };
  }
}

export const db = new Database();
