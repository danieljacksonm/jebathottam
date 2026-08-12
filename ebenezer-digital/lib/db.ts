import { loadStore, saveStore } from './persist';
import bcrypt from 'bcryptjs';
import { STORE_PRODUCTS } from '../app/products/data';

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
  /** ongoing = current client work, completed = delivered */
  projectPhase?: "ongoing" | "completed";
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

/** CMS news stories for E> World News (.info) */
export interface NewsArticleRecord {
  id: string;
  slug: string;
  title: string;
  dek: string;
  body: string[];
  region: string;
  topic: string;
  location: string;
  sourceLabel: string;
  coverImage: string;
  breaking?: boolean;
  featured?: boolean;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DigitalProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
  price: number;
  compareAt?: number;
  badge?: "BEST SELLER" | "NEW" | "FREE" | "BUNDLE";
  image: string;
  gallery: string[];
  features: string[];
  includes: string[];
  compatibility: string[];
  license: string[];
  whoItIsFor?: string;
  downloadContentsPlan?: string[];
  isSoftware?: boolean;
  externalUrl?: string;
  externalCta?: string;
  rating?: number;
  reviews?: number;
  isFree?: boolean;
  isBundle?: boolean;
  bundleItems?: string[];
  publishedAt?: Date;
  status: "draft" | "published";
  downloadFile?: string;
  fileName?: string;
  fileSize?: string;
  seoTitle?: string;
  seoDescription?: string;
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
    // bcrypt hash for: admin123
    password: "$2a$10$/MN/PDE1BQOvX0kq92d8COroVHvT.esnhYM7fM0oVFtxHQGKzYs0C",
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

// File-backed storage with in-memory fallback
type StoreData = {
  users: User[];
  services: Service[];
  portfolio: PortfolioItem[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  newsArticles?: NewsArticleRecord[];
  digitalProducts?: DigitalProduct[];
  team: TeamMember[];
  settings: SiteSettings;
};

class Database {
  users: User[];
  services: Service[];
  portfolio: PortfolioItem[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  newsArticles: NewsArticleRecord[];
  digitalProducts: DigitalProduct[];
  team: TeamMember[];
  settings: SiteSettings;
  private adminHashReady = false;

  constructor() {
    const stored = loadStore<StoreData | null>(null);
    if (stored) {
      this.users = stored.users.map((u) => ({ ...u, createdAt: new Date(u.createdAt), lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined }));
      this.services = stored.services.map((s) => ({ ...s, createdAt: new Date(s.createdAt), updatedAt: new Date(s.updatedAt) }));
      this.portfolio = stored.portfolio.map((p) => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) }));
      this.inquiries = stored.inquiries.map((i) => ({ ...i, createdAt: new Date(i.createdAt), repliedAt: i.repliedAt ? new Date(i.repliedAt) : undefined }));
      this.testimonials = stored.testimonials.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
      this.blogPosts = (stored.blogPosts || []).map((b) => ({ ...b, createdAt: new Date(b.createdAt), updatedAt: new Date(b.updatedAt), publishedAt: b.publishedAt ? new Date(b.publishedAt) : undefined }));
      this.newsArticles = (stored.newsArticles || []).map((n) => ({
        ...n,
        body: Array.isArray(n.body) ? n.body : String(n.body || "").split(/\n\n+/).filter(Boolean),
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
        publishedAt: n.publishedAt ? new Date(n.publishedAt) : undefined,
      }));
      this.digitalProducts = (stored.digitalProducts || []).map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : undefined,
      }));
      this.team = (stored.team || []).map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
      this.settings = stored.settings;
      this.syncDigitalProductsFromCatalog();
    } else {
      this.users = [...mockUsers];
      this.services = [...mockServices];
      this.portfolio = [...mockPortfolio];
      this.inquiries = [...mockInquiries];
      this.testimonials = [...mockTestimonials];
      this.blogPosts = [];
      this.newsArticles = [];
      this.digitalProducts = [];
      this.team = [];
      this.settings = {
        siteName: "Ebenezar Digital Services",
        siteDescription: "Reliable digital work for businesses everywhere.",
        contactEmail: "contact@ebenezar.com",
        socialLinks: {},
      };
      this.syncDigitalProductsFromCatalog();
      this.persist();
    }
  }

  /** Keep CMS catalog aligned with app/products/data.ts seed */
  private syncDigitalProductsFromCatalog() {
    const now = new Date();
    const bySlug = new Map(this.digitalProducts.map((p) => [p.slug, p]));
    this.digitalProducts = STORE_PRODUCTS.map((p) => {
      const existing = bySlug.get(p.slug);
      return {
        ...p,
        id: existing?.id || p.id,
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : now,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        status: p.status || "published",
      };
    });
    this.persist();
  }

  private persist() {
    saveStore({
      users: this.users,
      services: this.services,
      portfolio: this.portfolio,
      inquiries: this.inquiries,
      testimonials: this.testimonials,
      blogPosts: this.blogPosts,
      newsArticles: this.newsArticles,
      digitalProducts: this.digitalProducts,
      team: this.team,
      settings: this.settings,
    });
  }

  async ensureAdminPassword(defaultPassword: string, forceReset = false) {
    const admin = this.users.find((u) => u.role === 'admin');
    if (!admin) return;

    const needsHash =
      forceReset ||
      !admin.password ||
      admin.password.includes('PLACEHOLDER');

    if (needsHash) {
      admin.password = await bcrypt.hash(defaultPassword, 10);
      this.persist();
    }
    this.adminHashReady = true;
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.trim().toLowerCase() === normalized);
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

  async createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Promise<Inquiry> {
    const inquiry: Inquiry = {
      id: String(Date.now()),
      ...data,
      status: 'new',
      createdAt: new Date(),
    };
    this.inquiries.unshift(inquiry);
    this.persist();
    return inquiry;
  }

  async updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return undefined;
    this.inquiries[index] = { ...this.inquiries[index], ...data };
    this.persist();
    return this.inquiries[index];
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.inquiries.splice(index, 1);
    this.persist();
    return true;
  }

  // ---- Services ----
  async getServices(publishedOnly = false): Promise<Service[]> {
    let list = [...this.services];
    if (publishedOnly) list = list.filter((s) => s.status === "published");
    return list.sort((a, b) => a.order - b.order);
  }

  async createService(data: Omit<Service, "id" | "createdAt" | "updatedAt" | "order"> & { order?: number }): Promise<Service> {
    const item: Service = {
      ...data,
      id: String(Date.now()),
      order: data.order ?? this.services.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.services.push(item);
    this.persist();
    return item;
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service | undefined> {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    this.services[index] = { ...this.services[index], ...data, id, updatedAt: new Date() };
    this.persist();
    return this.services[index];
  }

  async deleteService(id: string): Promise<boolean> {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.services.splice(index, 1);
    this.persist();
    return true;
  }

  async reorderServices(ids: string[]): Promise<Service[]> {
    ids.forEach((id, i) => {
      const item = this.services.find((s) => s.id === id);
      if (item) item.order = i + 1;
    });
    this.persist();
    return this.getServices();
  }

  // ---- Portfolio ----
  async getPortfolio(publishedOnly = false): Promise<PortfolioItem[]> {
    let list = [...this.portfolio];
    if (publishedOnly) list = list.filter((p) => p.status === "published");
    return list.sort((a, b) => a.order - b.order);
  }

  async createPortfolioItem(data: Omit<PortfolioItem, "id" | "createdAt" | "updatedAt" | "order"> & { order?: number }): Promise<PortfolioItem> {
    const item: PortfolioItem = {
      ...data,
      id: String(Date.now()),
      order: data.order ?? this.portfolio.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.portfolio.push(item);
    this.persist();
    return item;
  }

  async updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem | undefined> {
    const index = this.portfolio.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.portfolio[index] = { ...this.portfolio[index], ...data, id, updatedAt: new Date() };
    this.persist();
    return this.portfolio[index];
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    const index = this.portfolio.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.portfolio.splice(index, 1);
    this.persist();
    return true;
  }

  // ---- Testimonials ----
  async getTestimonials(publishedOnly = false): Promise<Testimonial[]> {
    let list = [...this.testimonials];
    if (publishedOnly) list = list.filter((t) => t.status === "published");
    return list.sort((a, b) => a.order - b.order);
  }

  async createTestimonial(data: Omit<Testimonial, "id" | "createdAt" | "order"> & { order?: number }): Promise<Testimonial> {
    const item: Testimonial = {
      ...data,
      id: String(Date.now()),
      order: data.order ?? this.testimonials.length + 1,
      createdAt: new Date(),
    };
    this.testimonials.push(item);
    this.persist();
    return item;
  }

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const index = this.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.testimonials[index] = { ...this.testimonials[index], ...data, id };
    this.persist();
    return this.testimonials[index];
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const index = this.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.testimonials.splice(index, 1);
    this.persist();
    return true;
  }

  // ---- Blog ----
  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    let list = [...this.blogPosts];
    if (publishedOnly) list = list.filter((b) => b.status === "published");
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.find((b) => b.slug === slug && b.status === "published");
  }

  async createBlogPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    const item: BlogPost = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.unshift(item);
    this.persist();
    return item;
  }

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const index = this.blogPosts.findIndex((b) => b.id === id);
    if (index === -1) return undefined;
    this.blogPosts[index] = { ...this.blogPosts[index], ...data, id, updatedAt: new Date() };
    this.persist();
    return this.blogPosts[index];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const index = this.blogPosts.findIndex((b) => b.id === id);
    if (index === -1) return false;
    this.blogPosts.splice(index, 1);
    this.persist();
    return true;
  }

  // ---- World News (CMS) ----
  async getNewsArticles(publishedOnly = false): Promise<NewsArticleRecord[]> {
    let list = [...this.newsArticles];
    if (publishedOnly) list = list.filter((n) => n.status === "published");
    return list.sort((a, b) => {
      const at = a.publishedAt?.getTime() || a.createdAt.getTime();
      const bt = b.publishedAt?.getTime() || b.createdAt.getTime();
      return bt - at;
    });
  }

  async getNewsArticleBySlug(slug: string): Promise<NewsArticleRecord | undefined> {
    return this.newsArticles.find((n) => n.slug === slug && n.status === "published");
  }

  async createNewsArticle(
    data: Omit<NewsArticleRecord, "id" | "createdAt" | "updatedAt">
  ): Promise<NewsArticleRecord> {
    const item: NewsArticleRecord = {
      ...data,
      id: `news-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsArticles.unshift(item);
    this.persist();
    return item;
  }

  async updateNewsArticle(
    id: string,
    data: Partial<NewsArticleRecord>
  ): Promise<NewsArticleRecord | undefined> {
    const index = this.newsArticles.findIndex((n) => n.id === id);
    if (index === -1) return undefined;
    this.newsArticles[index] = {
      ...this.newsArticles[index],
      ...data,
      id,
      updatedAt: new Date(),
    };
    this.persist();
    return this.newsArticles[index];
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    const index = this.newsArticles.findIndex((n) => n.id === id);
    if (index === -1) return false;
    this.newsArticles.splice(index, 1);
    this.persist();
    return true;
  }

  // ---- Digital Store Products ----
  async getDigitalProducts(publishedOnly = false): Promise<DigitalProduct[]> {
    let list = [...this.digitalProducts];
    if (publishedOnly) list = list.filter((p) => p.status === "published");
    return list.sort((a, b) => {
      const at = a.publishedAt?.getTime() || a.createdAt.getTime();
      const bt = b.publishedAt?.getTime() || b.createdAt.getTime();
      return bt - at;
    });
  }

  async getDigitalProductBySlug(slug: string): Promise<DigitalProduct | undefined> {
    return this.digitalProducts.find((p) => p.slug === slug && p.status === "published");
  }

  async createDigitalProduct(
    data: Omit<DigitalProduct, "id" | "createdAt" | "updatedAt">
  ): Promise<DigitalProduct> {
    const item: DigitalProduct = {
      ...data,
      id: `dp${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.digitalProducts.unshift(item);
    this.persist();
    return item;
  }

  async updateDigitalProduct(id: string, data: Partial<DigitalProduct>): Promise<DigitalProduct | undefined> {
    const index = this.digitalProducts.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.digitalProducts[index] = {
      ...this.digitalProducts[index],
      ...data,
      id,
      updatedAt: new Date(),
    };
    this.persist();
    return this.digitalProducts[index];
  }

  async deleteDigitalProduct(id: string): Promise<boolean> {
    const index = this.digitalProducts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.digitalProducts.splice(index, 1);
    this.persist();
    return true;
  }

  // ---- Team ----
  async getTeam(): Promise<TeamMember[]> {
    return [...this.team].sort((a, b) => a.order - b.order);
  }

  async createTeamMember(data: Omit<TeamMember, "id" | "createdAt" | "order"> & { order?: number }): Promise<TeamMember> {
    const item: TeamMember = {
      ...data,
      id: String(Date.now()),
      order: data.order ?? this.team.length + 1,
      createdAt: new Date(),
    };
    this.team.push(item);
    this.persist();
    return item;
  }

  async updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const index = this.team.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.team[index] = { ...this.team[index], ...data, id };
    this.persist();
    return this.team[index];
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const index = this.team.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.team.splice(index, 1);
    this.persist();
    return true;
  }

  // ---- Settings ----
  async getSettings(): Promise<SiteSettings> {
    return this.settings;
  }

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    this.settings = { ...this.settings, ...data };
    this.persist();
    return this.settings;
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
      publishedStoreProducts: this.digitalProducts.filter((p) => p.status === "published").length,
    };
  }
}

export const db = new Database();
