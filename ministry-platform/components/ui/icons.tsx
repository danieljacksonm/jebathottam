'use client';

import {
  LayoutDashboard,
  Globe,
  FileText,
  Image,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Sparkles,
  FolderOpen,
  MessageCircle,
  Settings,
  BarChart3,
  Sliders,
  Share2,
  MessageSquare,
  Eye,
  TrendingUp,
  Target,
  Zap,
  Link2,
  Send,
  Save,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Music2,
  Plane,
  Smartphone,
  Video,
  ClipboardCheck,
  Flame,
  type LucideIcon,
} from 'lucide-react';

/** Admin sidebar navigation icons */
export const adminNavIcons = {
  dashboard: LayoutDashboard,
  socialMedia: Globe,
  blogs: FileText,
  gallery: Image,
  events: Calendar,
  team: Users,
  followers: Heart,
  attendance: ClipboardCheck,
  carmel: Flame,
  notes: BookOpen,
  prophecy: Sparkles,
  media: FolderOpen,
  chat: MessageCircle,
  slider: Sliders,
  testimonies: MessageSquare,
  audio: Music2,
  settings: Settings,
} as const;

/** Dashboard stats & activity icons */
export const statsIcons = {
  blog: FileText,
  events: Calendar,
  team: Users,
  prophecy: Sparkles,
  sermons: BookOpen,
  notes: FileText,
} as const;

/** Social media platform icons (Lucide has brand-style or generic) */
export const socialPlatformIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music2,
  telegram: Plane,
  whatsapp: MessageCircle,
};

/** Analytics & engagement icons */
export const analyticsIcons = {
  likes: Heart,
  comments: MessageSquare,
  shares: Share2,
  views: Eye,
  reach: TrendingUp,
  impressions: Target,
  engagement: Zap,
} as const;

/** Media type icons for post composer */
export const mediaTypeIcons = {
  text: FileText,
  image: Image,
  video: Video,
  carousel: Image,
  story: Smartphone,
  reel: Video,
} as const;

export {
  LayoutDashboard,
  Globe,
  FileText,
  Image,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Sparkles,
  FolderOpen,
  MessageCircle,
  Settings,
  BarChart3,
  Share2,
  MessageSquare,
  Eye,
  TrendingUp,
  Target,
  Zap,
  Link2,
  Send,
  Save,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Music2,
  Plane,
};
