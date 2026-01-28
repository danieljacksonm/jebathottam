'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { notes, noteCategories, noteTags } from '@/data/notes-content';
import type { Note } from '@/data/notes-content';

export default function NotesPage() {
  const [activeType, setActiveType] = useState<'all' | 'personal' | 'teaching' | 'prophecy'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredNotes = notes.filter((note) => {
    if (activeType !== 'all' && note.type !== activeType) return false;
    if (selectedCategory !== 'All' && note.category !== selectedCategory) return false;
    if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => note.tags.includes(tag))) return false;
    return true;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'teaching': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'prophecy': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Header */}
        <FadeInUp>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
              Notes Archive
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A preserved collection of teachings, prophecies, and personal reflections
            </p>
          </div>
        </FadeInUp>

        {/* Filters */}
        <FadeInUp delay={0.1}>
          <div className="max-w-6xl mx-auto mb-8">
            {/* Type Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {(['all', 'personal', 'teaching', 'prophecy'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Notes' : type === 'personal' ? 'Personal' : type === 'teaching' ? 'Teaching' : 'Prophecy'}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {noteCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeInUp>

        {/* Notes Grid */}
        <FadeInUp delay={0.2}>
          <div className="max-w-6xl mx-auto">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No notes found matching your criteria.</p>
              </div>
            ) : (
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map((note) => (
                    <StaggerItem key={note.id}>
                      <Link href={`/notes/${note.id}`}>
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 cursor-pointer h-full flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(note.type)}`}>
                              {note.type === 'personal' ? 'Personal' : note.type === 'teaching' ? 'Teaching' : 'Prophecy'}
                            </span>
                            {note.isPrivate && (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                          </div>
                          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 line-clamp-2">
                            {note.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                            {note.content.replace(/[#*]/g, '').substring(0, 150)}...
                          </p>
                          <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500">
                                {new Date(note.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                              <span className="text-xs text-gray-500">{note.author}</span>
                            </div>
                            {note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {note.tags.slice(0, 3).map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleTag(tag);
                                    }}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            )}
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
