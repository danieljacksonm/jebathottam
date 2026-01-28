import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'compact' | 'admin';
  className?: string;
}

export function Logo({ variant = 'default', className = '' }: LogoProps) {
  if (variant === 'compact') {
    return (
      <Link href="/" className={`flex items-center space-x-2 ${className}`}>
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white border-t-0 border-b-0 rounded-sm"></div>
          </div>
        </div>
        <span className="text-xl font-serif font-bold text-gray-900">JITW</span>
      </Link>
    );
  }

  if (variant === 'admin') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 border-2 border-white border-t-0 border-b-0 rounded-sm"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-serif font-bold text-white leading-tight">Jesus Is</span>
          <span className="text-xs font-serif text-white/80 leading-tight">The Way</span>
        </div>
      </div>
    );
  }

  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-lg flex items-center justify-center shadow-lg">
          <div className="w-5 h-5 border-2 border-white border-t-0 border-b-0 rounded-sm"></div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-serif font-bold text-gray-900 leading-tight">
          Jesus Is The Way
        </span>
        <span className="text-sm md:text-base font-serif text-primary-600 font-semibold leading-tight">
          Jebathottam
        </span>
      </div>
    </Link>
  );
}
