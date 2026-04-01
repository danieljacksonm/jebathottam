'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { notes } from '@/data/notes-content';
import type { Note } from '@/data/notes-content';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const note = notes.find(n => n.id === parseInt(params.id)) || notes[0];
  const relatedNotes = notes.filter(n => n.id !== note.id && (n.category === note.category || n.type === note.type)).slice(0, 3);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'teaching': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'prophecy': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-3xl font-serif font-bold text-gray-900 mt-8 mb-4">{line.substring(2)}</h2>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-2xl font-serif font-semibold text-gray-900 mt-6 mb-3">{line.substring(3)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="text-lg text-gray-700 ml-6 mb-2">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-lg text-gray-700 leading-relaxed mb-4">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/notes" className="hover:text-primary-600 transition-colors">
              Notes
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{note.title}</span>
          </nav>
        </FadeInUp>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <FadeInUp delay={0.1}>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getTypeColor(note.type)}`}>
                  {note.type === 'personal' ? 'Personal Note' : note.type === 'teaching' ? 'Teaching Note' : 'Prophecy Archive'}
                </span>
                {note.isPrivate && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm">Private</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                {note.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Author</p>
                  <p className="font-semibold text-gray-900">{note.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <time dateTime={note.date} className="font-semibold text-gray-900">
                    {new Date(note.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{note.category}</p>
                </div>
              </div>
              {note.scripture && (
                <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg">
                  <p className="text-lg font-serif italic text-gray-800 mb-2">
                    "{note.scripture}"
                  </p>
                  <p className="text-sm text-gray-600">Scripture Reference</p>
                </div>
              )}
            </div>
          </FadeInUp>

          {/* Content */}
          <FadeInUp delay={0.2}>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 border border-gray-200">
              <div className="prose prose-lg max-w-none">
                {formatContent(note.content)}
              </div>
            </div>
          </FadeInUp>

          {/* Tags */}
          {note.tags.length > 0 && (
            <FadeInUp delay={0.3}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInUp>
          )}

          {/* Legacy Notice for Prophecy */}
          {note.type === 'prophecy' && (
            <FadeInUp delay={0.4}>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-8 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">📜</div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
                      Preserved for Future Generations
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      This prophecy has been carefully preserved as part of our ministry archive. 
                      It serves as a testament to God's faithfulness and a resource for future generations 
                      seeking to understand His work in our time.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInUp>
          )}

          {/* Related Notes */}
          {relatedNotes.length > 0 && (
            <FadeInUp delay={0.5}>
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8">
                  Related Notes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNotes.map((relatedNote) => (
                    <Link key={relatedNote.id} href={`/notes/${relatedNote.id}`}>
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(relatedNote.type)}`}>
                            {relatedNote.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(relatedNote.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedNote.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedNote.content.replace(/[#*]/g, '').substring(0, 100)}...
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeInUp>
          )}

          {/* Footer Navigation */}
          <FadeInUp delay={0.6}>
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <Link
                href="/notes"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Notes Archive
              </Link>
            </footer>
          </FadeInUp>
        </article>
      </main>

      <Footer />
    </div>
  );
}
