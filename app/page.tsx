'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EnhancedImageSlider } from '@/components/ui/enhanced-image-slider';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { motion, useInView } from 'framer-motion';
import { ministryInfo as defaultInfo, blogPosts, events, missionVision as defaultMV } from '@/data/demo-content';
import { galleryImages as fallbackGalleryImages } from '@/data/gallery-content';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { AudioPlayer } from '@/components/audio/audio-player';
import { mediaItems as fallbackMedia } from '@/data/media-content';
import { PrayerForm } from '@/components/prayer/prayer-form';
import { ChatWidget } from '@/components/chat/chat-widget';

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const SHUFFLABLE_KEYS = ['blog', 'about', 'mission', 'testimonies', 'events', 'gallery', 'audio', 'media'];

function getShuffledSections(hour: number): string[] {
  return seededShuffle([...SHUFFLABLE_KEYS], hour + 1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOURLY ACCENT COLOR PALETTES
   ═══════════════════════════════════════════════════════════════════════════ */

const ACCENT_PALETTES = [
  { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', bar: '#7c3aed', glow: 'rgba(124,58,237,0.14)', dot: 'rgba(124,58,237,0.08)' },
  { gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)', bar: '#4f46e5', glow: 'rgba(79,70,229,0.14)',  dot: 'rgba(79,70,229,0.08)' },
  { gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', bar: '#a855f7', glow: 'rgba(168,85,247,0.14)', dot: 'rgba(168,85,247,0.08)' },
  { gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)', bar: '#0ea5e9', glow: 'rgba(14,165,233,0.14)', dot: 'rgba(14,165,233,0.08)' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', bar: '#f59e0b', glow: 'rgba(245,158,11,0.14)', dot: 'rgba(245,158,11,0.08)' },
  { gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', bar: '#ec4899', glow: 'rgba(236,72,153,0.14)', dot: 'rgba(236,72,153,0.08)' },
  { gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', bar: '#10b981', glow: 'rgba(16,185,129,0.14)', dot: 'rgba(16,185,129,0.08)' },
  { gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)', bar: '#6366f1', glow: 'rgba(99,102,241,0.14)', dot: 'rgba(99,102,241,0.08)' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATION COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrollReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedHeading({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top"
          style={{ marginRight: i < words.length - 1 ? '0.25em' : undefined }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: [0.33, 1, 0.68, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

function FloatingDecorations({ count = 6, color = 'rgba(99,102,241,0.08)' }: { count?: number; color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 4) * 8,
            height: 6 + (i % 4) * 8,
            background: color,
            top: `${10 + ((i * 17) % 80)}%`,
            right: `${3 + ((i * 13) % 15)}%`,
          }}
          animate={{ y: [0, -15 - i * 3, 0], x: [0, 8 + (i % 3) * 4, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}
    </div>
  );
}

function AnimatedImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`overflow-hidden ${className}`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
}

function InViewStagger({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      {children}
    </motion.div>
  );
}

function InViewStaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type SliderImage = { src: string; alt: string; title?: string; description?: string };
type MediaItem = { id: number; title: string; type: string; image_url?: string; video_id?: string; thumbnail_url?: string; message?: string; description?: string; scripture?: string; image?: string; thumbnail?: string; videoId?: string };

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

type HeroVariant = 'slider' | 'blog' | 'team' | 'about';
const HERO_VARIANTS: HeroVariant[] = ['slider', 'blog', 'team', 'about'];

type TeamMember = { id: number; name: string; role: string; bio?: string; image_url?: string | null };
type BlogPost = { id: number; title: string; excerpt?: string; content?: string; image?: string; image_url?: string; category?: string; featured?: boolean };
function getBlogImage(post: BlogPost | { image?: string; image_url?: string }): string {
  return (post as { image?: string; image_url?: string }).image || (post as { image?: string; image_url?: string }).image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop';
}

export default function Home() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [homeTestimonies, setHomeTestimonies] = useState<Array<{ id: number; name: string; content: string; image_url: string | null; created_at: string }>>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(fallbackMedia as unknown as MediaItem[]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [apiBlogs, setApiBlogs] = useState<BlogPost[]>([]);
  const [homeGallery, setHomeGallery] = useState<Array<{ id: number; title: string; description?: string | null; image_url?: string; image?: string; category?: string }>>([]);

  const [sectionOrder, setSectionOrder] = useState(SHUFFLABLE_KEYS);
  const [currentHour, setCurrentHour] = useState(0);
  const hourRef = useRef(-1);

  /* ── Data fetching ───────────────────────────────────────────────────── */
  useEffect(() => {
    fetch('/api/settings?scope=public')
      .then((res) => (res.ok ? res.json() : { data: {} }))
      .then((data) => { if (data?.data) setSiteSettings(data.data); })
      .catch(() => {});

    fetch('/api/slider')
      .then((res) => res.ok ? res.json() : { data: [] })
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setSliderImages(
          list
            .filter((s: { image_url?: string }) => s?.image_url && String(s.image_url).trim())
            .map((s: { image_url: string; title?: string; text?: string; description?: string }) => {
              const raw = s.image_url.startsWith('/') || s.image_url.startsWith('http') ? s.image_url : `/${s.image_url.replace(/^\//, '')}`;
              const src = getOptimizedImageUrl(raw, 1200) || raw;
              return { src, alt: s.title || s.text || 'Ministry', title: s.title || undefined, description: s.description || undefined };
            })
        );
      })
      .catch(() => setSliderImages([]));

    fetch('/api/testimonies')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setHomeTestimonies(list.slice(0, 3));
      })
      .catch(() => setHomeTestimonies([]));

    fetch('/api/media')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) setMediaItems(list);
      })
      .catch(() => {});

    fetch('/api/team')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) setTeamMembers(list.slice(0, 6));
      })
      .catch(() => {});

    fetch('/api/blogs?published=true')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) setApiBlogs(list);
      })
      .catch(() => {});

    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) {
          setHomeGallery(list.map((g: { id: number; title: string; description?: string; image_url: string }) => ({
            id: g.id,
            title: g.title,
            description: g.description ?? null,
            image_url: g.image_url,
            image: g.image_url,
            category: 'Ministry',
          })));
        } else {
          setHomeGallery(fallbackGalleryImages.map((g) => ({ ...g, image_url: g.image })));
        }
      })
      .catch(() => setHomeGallery(fallbackGalleryImages.map((g) => ({ ...g, image_url: g.image }))));
  }, []);

  /* ── Section shuffle on the hour ─────────────────────────────────────── */
  useEffect(() => {
    const hour = new Date().getHours();
    hourRef.current = hour;
    setCurrentHour(hour);
    setSectionOrder(getShuffledSections(hour));

    const interval = setInterval(() => {
      const h = new Date().getHours();
      if (h !== hourRef.current) {
        hourRef.current = h;
        setCurrentHour(h);
        setSectionOrder(getShuffledSections(h));
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  /* ── Derived data ─────────────────────────────────────────────────────── */
  const accent = ACCENT_PALETTES[currentHour % ACCENT_PALETTES.length];

  const info = {
    name: siteSettings.ministry_name || defaultInfo.name,
    subtitle: siteSettings.ministry_subtitle || defaultInfo.subtitle,
    tagline: siteSettings.ministry_tagline || defaultInfo.tagline,
    scripture: siteSettings.ministry_scripture || defaultInfo.scripture,
    email: siteSettings.ministry_email || defaultInfo.email,
    phone: siteSettings.ministry_phone || defaultInfo.phone,
    address: siteSettings.ministry_address || defaultInfo.address,
  };
  const about = {
    heading: siteSettings.about_heading || 'About Us',
    text: siteSettings.about_text || 'We are a Christian ministry dedicated to preserving God-spoken words and encouraging believers through digital tools. Our mission is to create a trustworthy platform that serves our community and future generations.',
    textSecondary: siteSettings.about_text_secondary || 'With reverence and care, we document prophecies, teachings, and revelations that God speaks to His people, ensuring these precious words are preserved for future generations.',
  };
  const mv = {
    mission: {
      title: siteSettings.mission_title || defaultMV.mission.title,
      description: siteSettings.mission_description || defaultMV.mission.description,
      icon: defaultMV.mission.icon,
    },
    vision: {
      title: siteSettings.vision_title || defaultMV.vision.title,
      description: siteSettings.vision_description || defaultMV.vision.description,
      icon: defaultMV.vision.icon,
    },
  };

  const blogSource = apiBlogs.length > 0 ? apiBlogs : blogPosts;
  const featuredBlog = blogSource.find((post: BlogPost) => post.featured) || blogSource[0];
  const regularBlogs = blogSource.filter((post: BlogPost) => !post.featured).slice(0, 3);

  const heroVariant = HERO_VARIANTS[currentHour % HERO_VARIANTS.length];

  /* ════════════════════════════════════════════════════════════════════════
     SECTION RENDERERS  (keyed by shufflable id)
     ════════════════════════════════════════════════════════════════════════ */

  const sections: Record<string, (bg: string) => ReactNode> = {

    /* ── BLOG ──────────────────────────────────────────────────────────── */
    blog: (bg) => (
      <section id="blog" className={`py-20 lg:py-28 ${bg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                From the blog
              </span>
              <AnimatedHeading
                text="Latest reflections"
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight"
              />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Teachings, testimonies, and insights from our ministry
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link href={`/blog/${featuredBlog.id}`} className="block group mb-16">
              <motion.article
                whileHover={{ boxShadow: `0 25px 50px -12px ${accent.glow}` }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-800"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <AnimatedImage
                    src={getBlogImage(featuredBlog)}
                    alt={featuredBlog.title}
                    className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]"
                  />
                  <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 mb-4">
                      <span className="font-semibold text-primary-600 dark:text-primary-400 text-xs uppercase tracking-wider">{featuredBlog.category}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="text-xs">{calculateReadingTime(featuredBlog.content || featuredBlog.excerpt || '')} min read</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight tracking-tight">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed">
                      {featuredBlog.excerpt || (featuredBlog as { content?: string }).content?.replace(/<[^>]*>/g, '').slice(0, 200) || ''}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                      Continue reading
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          </ScrollReveal>

          <InViewStagger>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-14">
              {regularBlogs.map((post) => (
                <InViewStaggerItem key={post.id}>
                  <Link href={`/blog/${post.id}`} className="block group h-full">
                    <motion.article
                      whileHover={{ y: -6, boxShadow: `0 25px 50px -12px ${accent.glow}` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={getBlogImage(post)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      </div>
                      <div className="p-6 lg:p-7 flex-1 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.15em]">{post.category}</span>
                        <h3 className="text-lg lg:text-xl font-serif font-bold text-gray-900 dark:text-white mt-2.5 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 leading-snug">{post.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 flex-1 line-clamp-2 leading-relaxed">{post.excerpt || (post as { content?: string }).content?.replace(/<[^>]*>/g, '').slice(0, 150) || ''}</p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all duration-300">
                          Read more
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                </InViewStaggerItem>
              ))}
            </div>
          </InViewStagger>

          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <Link href="/blog">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">View all posts</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    ),

    /* ── ABOUT US ──────────────────────────────────────────────────────── */
    about: (bg) => (
      <section id="about" className={`py-20 lg:py-28 ${bg} relative`}>
        <FloatingDecorations count={5} color={accent.dot} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal>
                <div className="relative">
                  <AnimatedImage
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
                    alt="About our ministry"
                    className="aspect-[4/3] rounded-2xl shadow-2xl"
                  />
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-10"
                    style={{ background: accent.dot }}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute -top-4 -left-4 w-32 h-32 rounded-full -z-10"
                    style={{ background: accent.dot }}
                    animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div>
                  <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Who we are</span>
                  <AnimatedHeading text={about.heading} className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-6 tracking-tight" />
                  <div className="w-12 h-0.5 mb-8" style={{ background: accent.bar }} />
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">{about.text}</p>
                  <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">{about.textSecondary}</p>
                  <Link href="/about">
                    <Button size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">Our story</Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    ),

    /* ── MISSION & VISION ──────────────────────────────────────────────── */
    mission: (bg) => (
      <section id="mission" className={`py-20 lg:py-28 ${bg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Purpose</span>
              <AnimatedHeading text="Mission & Vision" className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight" />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">The calling that drives everything we do</p>
            </div>
          </ScrollReveal>

          <InViewStagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl">
              <InViewStaggerItem>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 25px 50px -12px ${accent.glow}` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 h-full relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: accent.gradient }} />
                  <div className="text-5xl mb-6">{mv.mission.icon}</div>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">{mv.mission.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{mv.mission.description}</p>
                </motion.div>
              </InViewStaggerItem>

              <InViewStaggerItem>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 25px 50px -12px ${accent.glow}` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 h-full relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: accent.gradient }} />
                  <div className="text-5xl mb-6">{mv.vision.icon}</div>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">{mv.vision.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{mv.vision.description}</p>
                </motion.div>
              </InViewStaggerItem>
            </div>
          </InViewStagger>

          <ScrollReveal delay={0.3}>
            <div className="mt-14">
              <Link href="/mission">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">Full mission statement</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    ),

    /* ── TESTIMONIES ───────────────────────────────────────────────────── */
    testimonies: (bg) => (
      <section id="testimony" className={`py-20 lg:py-28 ${bg} relative`}>
        <FloatingDecorations count={4} color={accent.dot} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Stories of faith</span>
              <AnimatedHeading text="Testimonies" className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight" />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">God&apos;s faithfulness witnessed through transformed lives</p>
            </div>
          </ScrollReveal>

          <InViewStagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mb-14">
              {homeTestimonies.map((testimony) => (
                <InViewStaggerItem key={testimony.id}>
                  <Link href={`/testimony/${testimony.id}`} className="block h-full">
                    <motion.div whileHover={{ y: -6, boxShadow: `0 25px 50px -12px ${accent.glow}` }} transition={{ duration: 0.3, ease: 'easeOut' }} className="h-full">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 h-full flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: accent.gradient }} />

                        <svg className="w-8 h-8 text-primary-200 dark:text-primary-900 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6 flex-1 line-clamp-4 leading-relaxed italic">
                          &ldquo;{testimony.content}&rdquo;
                        </p>

                        <div className="flex items-center gap-3.5 pt-5 border-t border-gray-100 dark:border-gray-800">
                          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary-100 dark:ring-primary-900/30 flex-shrink-0">
                            <img
                              src={getOptimizedImageUrl(testimony.image_url, 128) || testimony.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3C/svg%3E'}
                              alt={testimony.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{testimony.name}</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {new Date(testimony.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-300">
                            Read &rarr;
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </InViewStaggerItem>
              ))}
            </div>
          </InViewStagger>

          <ScrollReveal delay={0.4}>
            <div>
              <Link href="/testimony">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">View all testimonies</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    ),

    /* ── EVENTS ────────────────────────────────────────────────────────── */
    events: (bg) => (
      <section id="events" className={`py-20 lg:py-28 ${bg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Join us</span>
              <AnimatedHeading text="Upcoming events" className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight" />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">Worship, fellowship, and spiritual growth</p>
            </div>
          </ScrollReveal>

          <InViewStagger>
            <div className="max-w-4xl space-y-5 mb-14">
              {events.map((event) => (
                <InViewStaggerItem key={event.id}>
                  <motion.div whileHover={{ x: 4, boxShadow: `0 20px 40px -12px ${accent.glow}` }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 overflow-hidden group">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 sm:w-28 lg:w-32">
                          <div className="text-white p-5 sm:p-0 sm:h-full flex sm:flex-col items-center sm:justify-center gap-2 sm:gap-0 text-center" style={{ background: accent.gradient }}>
                            <span className="text-3xl sm:text-4xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                            <span className="text-xs sm:text-sm uppercase tracking-wider font-medium text-white/80">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          </div>
                        </div>
                        <div className="flex-1 p-6 sm:p-7 lg:p-8">
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{event.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base leading-relaxed">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </InViewStaggerItem>
              ))}
            </div>
          </InViewStagger>

          <ScrollReveal delay={0.4}>
            <div>
              <Link href="/events">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">View all events</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    ),

    /* ── GALLERY ───────────────────────────────────────────────────────── */
    gallery: (bg) => (
      <section id="gallery" className={`py-20 lg:py-28 ${bg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Moments</span>
              <AnimatedHeading text="Gallery" className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight" />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">Glimpses from our ministry gatherings and events</p>
            </div>
          </ScrollReveal>

          <InViewStagger>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mb-14">
              {(homeGallery.length > 0 ? homeGallery : fallbackGalleryImages).slice(0, 8).map((image) => {
                const imgSrc = image.image_url || image.image || '';
                const optSrc = getOptimizedImageUrl(imgSrc, 400);
                return (
                <InViewStaggerItem key={image.id}>
                  <Link href={`/gallery/${image.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, boxShadow: `0 25px 50px -12px ${accent.glow}` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm cursor-pointer"
                    >
                      <img src={optSrc || imgSrc} alt={image.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                          <h3 className="text-sm sm:text-base font-semibold mb-0.5 leading-tight">{image.title}</h3>
                          <p className="text-xs text-white/75">{image.category || 'Ministry'}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </InViewStaggerItem>
              );
              })}
            </div>
          </InViewStagger>

          <ScrollReveal delay={0.4}>
            <div>
              <Link href="/gallery">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">View full gallery</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    ),

    /* ── 24 HOURS AUDIO ────────────────────────────────────────────────── */
    audio: (bg) => (
      <section id="audio" className={`py-20 lg:py-28 ${bg} relative`}>
        <FloatingDecorations count={4} color={accent.dot} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Always on</span>
              <AnimatedHeading text="24-Hour Audio" className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight" />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">Continuous worship, prayer, and the Word — any time, day or night</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 lg:p-10">
              <AudioPlayer />
            </div>
          </ScrollReveal>
        </div>
      </section>
    ),

    /* ── MEDIA ─────────────────────────────────────────────────────────── */
    media: (bg) => (
      <section id="media" className={`py-20 lg:py-28 ${bg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Watch &amp; listen</span>
              <AnimatedHeading text="Media" className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight" />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">Posters, videos, and messages from the ministry</p>
            </div>
          </ScrollReveal>

          <InViewStagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mb-14">
              {mediaItems.slice(0, 4).map((item) => {
                const imgSrc = getOptimizedImageUrl(item.image_url || item.image || '', 500) || item.image_url || item.image || '';
                const thumbSrc = getOptimizedImageUrl(item.thumbnail_url || item.thumbnail || '', 400) || item.thumbnail_url || item.thumbnail || '';
                const vidId = item.video_id || item.videoId || '';
                const posterScripture = item.message || item.scripture || '';
                return (
                  <InViewStaggerItem key={item.id}>
                    <Link href={`/media/${item.id}`}>
                      <motion.div
                        whileHover={{ y: -6, boxShadow: `0 25px 50px -12px ${accent.glow}` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-800 group"
                      >
                        {item.type === 'poster' ? (
                          <div className="aspect-[2/3] overflow-hidden">
                            <img src={imgSrc} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                          </div>
                        ) : (
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={thumbSrc || (vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : '')}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                              <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            </div>
                            {item.type === 'youtube-shorts' && (
                              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">Shorts</div>
                            )}
                          </div>
                        )}
                        <div className="p-4 sm:p-5">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{item.title}</h3>
                          {item.type === 'poster' && posterScripture && (
                            <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 mt-1.5 font-medium">{posterScripture}</p>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  </InViewStaggerItem>
                );
              })}
            </div>
          </InViewStagger>

          <ScrollReveal delay={0.4}>
            <div>
              <Link href="/media">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">View all media</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    ),
  };

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════════════ */

  const prayerBg = sectionOrder.length % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900/50';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col antialiased">
      <Navigation />

      {/* ── HERO (rotates: slider, blog, team, about) ───────────────────── */}
      {heroVariant === 'slider' && (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <EnhancedImageSlider images={sliderImages} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
          <div className="absolute inset-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="text-center text-white max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
                <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/70 border border-white/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm bg-white/5">
                  {info.subtitle}
                </span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold mb-5 leading-[1.05] tracking-tight">
                  {info.name}
                </h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}>
                <p className="text-base sm:text-lg md:text-xl text-white/85 mb-5 max-w-xl mx-auto leading-relaxed font-light">
                  {info.tagline}
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}>
                <div className="w-12 h-px bg-white/30 mx-auto mb-5" />
                <p className="text-sm sm:text-base font-serif italic text-white/60 mb-10 max-w-lg mx-auto">
                  &ldquo;{info.scripture}&rdquo;
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/#blog">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full px-8 font-medium text-sm tracking-wide">
                      Read &amp; reflect
                    </Button>
                  </Link>
                  <Link href="/audio-conference/join">
                    <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 font-medium text-sm tracking-wide backdrop-blur-sm">
                      Join a call
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-20 pointer-events-none" />
        </section>
      )}

      {heroVariant === 'blog' && featuredBlog && (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <img
              src={getBlogImage(featuredBlog)}
              alt={featuredBlog.title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
          </div>
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">
                  {featuredBlog.category || 'Featured'}
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-4 mb-6 leading-tight"
              >
                {featuredBlog.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-white/85 mb-8 line-clamp-3"
              >
                {featuredBlog.excerpt || (featuredBlog as { content?: string }).content?.replace(/<[^>]*>/g, '').slice(0, 200) || ''}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Link href={`/blog/${featuredBlog.id}`}>
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8">
                    Read article
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        </section>
      )}

      {heroVariant === 'team' && (
        <section className="relative min-h-[85vh] py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary-400 blur-3xl" />
          </div>
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="text-xs font-semibold text-primary-300 uppercase tracking-[0.2em]">Meet our leaders</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-4">
                {info.name}
              </h1>
              <p className="text-lg text-white/80 max-w-xl mx-auto">{info.tagline}</p>
            </motion.div>
            <InViewStagger>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {(teamMembers.length > 0 ? teamMembers : [
                  { id: 1, name: 'Pastor John', role: 'Senior Pastor', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
                  { id: 2, name: 'Pastor Sarah', role: 'Associate Pastor', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
                  { id: 3, name: 'Michael', role: 'Worship', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
                  { id: 4, name: 'Emily', role: 'Youth', image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
                  { id: 5, name: 'David', role: 'Admin', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
                  { id: 6, name: 'Lisa', role: 'Prayer', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
                ]).slice(0, 6).map((member: TeamMember, i: number) => (
                  <InViewStaggerItem key={member.id}>
                    <Link href="/team" className="block group">
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="text-center"
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden ring-2 ring-white/20 group-hover:ring-primary-400 transition-all mb-3">
                          <img
                            src={getOptimizedImageUrl(member.image_url, 300) || member.image_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop`}
                            alt={member.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="font-semibold text-white text-sm truncate">{member.name}</h3>
                        <p className="text-xs text-primary-200 truncate">{member.role}</p>
                      </motion.div>
                    </Link>
                  </InViewStaggerItem>
                ))}
              </div>
            </InViewStagger>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-10">
              <Link href="/team">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8">
                  Meet the full team
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        </section>
      )}

      {heroVariant === 'about' && (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop"
              alt="Ministry"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/50" />
          </div>
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs font-semibold text-primary-400 uppercase tracking-[0.2em]">Who we are</span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mt-4 mb-6 leading-tight">
                  {about.heading}
                </h1>
                <div className="w-16 h-1 bg-primary-500 mx-auto mb-8" />
                <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-6">
                  {about.text}
                </p>
                <p className="text-lg text-white/70 italic max-w-xl mx-auto mb-10">
                  &ldquo;{info.scripture}&rdquo;
                </p>
                <Link href="/about">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8">
                    Our story
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        </section>
      )}

      {/* ── SHUFFLED MIDDLE SECTIONS ───────────────────────────────────── */}
      <div>
        {sectionOrder.map((key, idx) => {
          const bg = idx % 2 === 0
            ? 'bg-white dark:bg-gray-950'
            : 'bg-gray-50 dark:bg-gray-900/50';
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {sections[key](bg)}
            </motion.div>
          );
        })}
      </div>

      {/* ── PRAYER FORM (always last) ──────────────────────────────────── */}
      <section id="prayer" className={`py-20 lg:py-28 ${prayerBg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">We stand with you</span>
              <AnimatedHeading text="Prayer Request" className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight" />
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">Share your heart with us — our team commits to pray over every request</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="max-w-2xl">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 lg:p-10">
                <PrayerForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
