'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PrayerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    prayerPoint: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit prayer request');
      
      setIsSubmitting(false);
      setIsSuccess(true);

      setFormData({
        name: '',
        email: '',
        phone: '',
        prayerPoint: '',
      });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage('Failed to submit prayer request. Please try again or contact us directly.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 sm:p-10 text-center"
          >
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-3">
              Prayer Request Received
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm sm:text-base max-w-md mx-auto">
              Thank you for sharing your prayer point with us. Our team will lift your request before the Lord.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic max-w-sm mx-auto">
              &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&rdquo; &mdash; Philippians 4:6
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200" role="alert">
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
            
            <p className="text-sm text-primary-600 dark:text-primary-400 italic mb-2">
              &ldquo;The prayer of a righteous person is powerful and effective.&rdquo; &mdash; James 5:16
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label htmlFor="prayerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <Input
                  id="prayerName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="prayerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <Input
                  id="prayerEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="prayerPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number (Optional)
              </label>
              <Input
                id="prayerPhone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="prayerPoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prayer Point <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="prayerPoint"
                name="prayerPoint"
                value={formData.prayerPoint}
                onChange={handleChange}
                required
                aria-required="true"
                rows={5}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Share your prayer request here..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Prayer Request'
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
