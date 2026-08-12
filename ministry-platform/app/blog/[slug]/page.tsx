import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { query } from '@/lib/db';

const SITE_URL = 'https://jesusisthewayjebathottam.com';
const SITE_NAME = 'Jesus is the Way Jebathottam';

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  title_ta: string | null;
  content: string;
  content_ta: string | null;
  excerpt: string | null;
  excerpt_ta: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  og_image: string | null;
  featured_image: string | null;
  tags: string | null;
  author: string | null;
  author_name: string | null;
  category: string | null;
  created_at: string;
  published_at: string | null;
};

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

async function getPublishedBlog(slugOrId: string): Promise<BlogRow | null> {
  const isNumeric = /^\d+$/.test(slugOrId);
  const rows = await query<BlogRow[]>(
    `SELECT b.*, u.name as author_name
     FROM blogs b
     LEFT JOIN users u ON b.created_by = u.id
     WHERE b.published = 1 AND (${isNumeric ? 'b.id = ? OR b.slug = ?' : 'b.slug = ?'})
     LIMIT 1`,
    isNumeric ? [Number(slugOrId), slugOrId] : [slugOrId]
  );
  return rows[0] || null;
}

async function getRelated(post: BlogRow): Promise<BlogRow[]> {
  const rows = await query<BlogRow[]>(
    `SELECT b.*, u.name as author_name
     FROM blogs b
     LEFT JOIN users u ON b.created_by = u.id
     WHERE b.published = 1 AND b.id != ?
       AND (b.category = ? OR ? IS NULL)
     ORDER BY b.created_at DESC
     LIMIT 3`,
    [post.id, post.category, post.category]
  );
  return rows;
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const isTa = lang === 'ta';
  const post = await getPublishedBlog(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  const title = isTa && post.title_ta ? post.title_ta : post.title;
  const description =
    (isTa && post.excerpt_ta ? post.excerpt_ta : null) ||
    post.meta_desc ||
    post.excerpt ||
    post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);

  const pageTitle = post.meta_title || title;
  const image = post.og_image || post.featured_image || undefined;
  const canonical = `${SITE_URL}/blog/${post.slug || post.id}`;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'article',
      locale: isTa ? 'ta_IN' : 'en_IN',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const isTa = lang === 'ta';

  const post = await getPublishedBlog(slug);
  if (!post) notFound();

  // Fire-and-forget view count (ignore errors)
  try {
    await query('UPDATE blogs SET views = views + 1 WHERE id = ?', [post.id]);
  } catch {
    /* ignore */
  }

  const related = await getRelated(post);
  const displayTitle = isTa && post.title_ta ? post.title_ta : post.title;
  const displayContent = isTa && post.content_ta ? post.content_ta : post.content;
  const author = post.author || post.author_name;
  const readingTime = calculateReadingTime(displayContent);
  const heroImage = post.featured_image || post.og_image;
  const dateSrc = post.published_at || post.created_at;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{displayTitle}</span>
        </nav>

        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/blog/${post.slug || post.id}`}
            className={!isTa ? 'font-semibold text-primary-700' : 'text-gray-600 hover:text-primary-600'}
          >
            English
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href={`/blog/${post.slug || post.id}?lang=ta`}
            className={isTa ? 'font-semibold text-primary-700' : 'text-gray-600 hover:text-primary-600'}
          >
            தமிழ்
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          <div
            className="relative h-64 md:h-80 mb-12 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-end"
            style={
              heroImage
                ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : undefined
            }
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="relative z-10 p-8 text-white w-full">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wide mb-2">
                {post.category || 'Article'}
              </span>
              <p className="text-sm opacity-90">{readingTime} min read</p>
            </div>
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              {displayTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              {author && (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {author.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{author}</p>
                    <time dateTime={dateSrc} className="text-sm">
                      {new Date(dateSrc).toLocaleDateString(isTa ? 'ta-IN' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              )}
              {!author && (
                <time dateTime={dateSrc} className="text-sm">
                  {new Date(dateSrc).toLocaleDateString(isTa ? 'ta-IN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary-600 prose-blockquote:italic prose-blockquote:text-gray-700
              prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />

          <div className="mt-16 p-8 sm:p-10 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800 text-center">
            <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">Continue Your Journey</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Take time to meditate on these words. Let them sink deep into your heart and transform your walk with God.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/blog"><Button size="lg">Explore More Articles</Button></Link>
              <Link href="/prayer"><Button variant="secondary" size="lg">Submit Prayer Request</Button></Link>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug || p.id}`}>
                    <div className="group cursor-pointer">
                      <div
                        className="h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 group-hover:opacity-90 transition-opacity"
                        style={
                          p.featured_image
                            ? { backgroundImage: `url(${p.featured_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : undefined
                        }
                      />
                      <div className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-2">{p.category || 'Article'}</div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                        {p.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {(p.excerpt || p.content).replace(/<[^>]+>/g, ' ').trim().slice(0, 100)}…
                      </p>
                      <span className="mt-2 inline-block text-sm text-primary-600 font-medium group-hover:underline">Read more →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
