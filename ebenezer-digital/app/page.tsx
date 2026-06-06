'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimateSection, AnimateOne } from "./components/AnimateOnScroll";
import ScrollParallax from "./components/ScrollParallax";
import TextReveal from "./components/TextReveal";
import MagneticButton from "./components/MagneticButton";
import CharReveal from "./components/CharReveal";
import { IMG } from "@/lib/images";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ebenezer Digital</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/60 text-sm">Loading</span>
            <span className="loading-dots">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
          </div>
        </div>
        <style jsx>{`
          .loading-dots .dot {
            display: inline-block;
            animation: dotPulse 1.4s infinite ease-in-out both;
          }
          .loading-dots .dot:nth-child(1) { animation-delay: -0.32s; }
          .loading-dots .dot:nth-child(2) { animation-delay: -0.16s; }
          @keyframes dotPulse {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Sophisticated Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrollY > 50 ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-white">
                Ebenezer<span className="text-blue-400">.</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/services" className="text-white/80 hover:text-white transition-colors">Services</Link>
                <Link href="/work" className="text-white/80 hover:text-white transition-colors">Work</Link>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-gray-900/95 backdrop-blur-md transition-all duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            <Link href="/services" className="text-3xl font-light text-white/80 hover:text-white transition-colors">Services</Link>
            <Link href="/work" className="text-3xl font-light text-white/80 hover:text-white transition-colors">Work</Link>
            <Link href="/about" className="text-3xl font-light text-white/80 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-3xl font-light text-white/80 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <ScrollParallax className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <AnimateOne variant="fade-up" delay={200}>
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-blue-400 tracking-wider uppercase bg-blue-400/10 px-4 py-2 rounded-full border border-blue-400/20">
                Digital Excellence Since 2020
              </span>
            </div>
          </AnimateOne>

          <AnimateOne variant="fade-up" delay={400}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="block">Transform Your</span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Digital Presence</span>
            </h1>
          </AnimateOne>

          <AnimateOne variant="fade-up" delay={600}>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We craft exceptional digital experiences that drive growth, 
              engage audiences, and deliver measurable results for businesses worldwide.
            </p>
          </AnimateOne>

          <AnimateOne variant="fade-up" delay={800}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <MagneticButton
                href="/contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </MagneticButton>
              
              <Link
                href="/work"
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:border-white/40"
              >
                View Our Work
              </Link>
            </div>
          </AnimateOne>

          {/* Animated Stats */}
          <AnimateOne variant="fade-up" delay={1000}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { number: "150+", label: "Projects Completed" },
                { number: "98%", label: "Client Satisfaction" },
                { number: "24/7", label: "Support Available" },
                { number: "50+", label: "Team Members" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <span className="counter">{stat.number}</span>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimateOne>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </ScrollParallax>

      {/* Services Preview Section */}
      <ScrollParallax className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <AnimateOne variant="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
              What We Do Best
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
              From strategy to execution, we deliver comprehensive digital solutions 
              tailored to your unique business needs.
            </p>
          </AnimateOne>

          <AnimateSection variant="fade-up" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Web Development",
                description: "Custom websites and web applications built with cutting-edge technologies",
                features: ["React/Next.js", "Node.js", "Responsive Design", "SEO Optimized"]
              },
              {
                icon: "📱",
                title: "Mobile Solutions",
                description: "Native and cross-platform mobile applications for iOS and Android",
                features: ["React Native", "Flutter", "iOS/Android", "App Store Deployment"]
              },
              {
                icon: "🎨",
                title: "UI/UX Design",
                description: "Beautiful, intuitive designs that delight users and drive engagement",
                features: ["User Research", "Prototyping", "Design Systems", "User Testing"]
              },
              {
                icon: "⚡",
                title: "Performance Optimization",
                description: "Speed and performance improvements for existing applications",
                features: ["Code Optimization", "CDN Setup", "Database Tuning", "Caching"]
              },
              {
                icon: "🔒",
                title: "Security Solutions",
                description: "Comprehensive security audits and implementation for your applications",
                features: ["Security Audits", "Encryption", "Authentication", "Compliance"]
              },
              {
                icon: "☁️",
                title: "Cloud Services",
                description: "Cloud migration, setup, and management for scalable infrastructure",
                features: ["AWS/Azure", "DevOps", "Monitoring", "Backup Solutions"]
              }
            ].map((service, index) => (
              <div key={index} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </AnimateSection>
        </div>
      </ScrollParallax>

      {/* CTA Section */}
      <ScrollParallax className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <AnimateOne variant="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your digital goals. 
              Get a free consultation and project estimate today.
            </p>
            <MagneticButton
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Get Started Today
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </MagneticButton>
          </AnimateOne>
        </div>
      </ScrollParallax>

      <style jsx global>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .counter {
          animation: countUp 2s ease-out;
        }
        
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
