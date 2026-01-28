'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { testimonies } from '@/data/testimonies-content';

export default function TestimonyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Testimonies</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
              Testimonies
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stories of God's faithfulness and transformation in the lives of believers
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {testimonies.map((testimony) => (
              <StaggerItem key={testimony.id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/testimony/${testimony.id}`}>
                    <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary-100">
                            <img
                              src={testimony.image}
                              alt={testimony.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{testimony.name}</h3>
                            <p className="text-sm text-gray-600">{testimony.location}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4 line-clamp-4 leading-relaxed">
                          "{testimony.testimony}"
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                            {testimony.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(testimony.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </main>

      <Footer />
    </div>
  );
}
