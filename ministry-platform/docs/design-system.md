# Design System - Digital Ministry Platform

## Core Principles
- **Calm & Respectful**: Ministry-appropriate, trustworthy design
- **Clarity over Visual Noise**: Clean, uncluttered interfaces
- **Accessibility First**: WCAG compliant, keyboard navigation
- **Mobile-First**: Responsive design starting from mobile
- **Data Longevity**: Design that ages well, not trend-dependent

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes
- **Display**: text-4xl (36px) / text-5xl (48px) - Hero sections
- **Heading 1**: text-3xl (30px) - Page titles
- **Heading 2**: text-2xl (24px) - Section titles
- **Heading 3**: text-xl (20px) - Subsection titles
- **Body Large**: text-lg (18px) - Important content
- **Body**: text-base (16px) - Default text
- **Body Small**: text-sm (14px) - Secondary text
- **Caption**: text-xs (12px) - Labels, metadata

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights
- **Tight**: leading-tight (1.25)
- **Normal**: leading-normal (1.5)
- **Relaxed**: leading-relaxed (1.75)

## Color Palette

### Primary Colors
- **Primary**: Indigo/Purple tones (trustworthy, spiritual)
  - Primary-50: #eef2ff
  - Primary-100: #e0e7ff
  - Primary-500: #6366f1
  - Primary-600: #4f46e5
  - Primary-700: #4338ca
  - Primary-900: #312e81

### Neutral Colors
- **Gray Scale**: Clean, professional grays
  - Gray-50: #f9fafb
  - Gray-100: #f3f4f6
  - Gray-200: #e5e7eb
  - Gray-300: #d1d5db
  - Gray-400: #9ca3af
  - Gray-500: #6b7280
  - Gray-600: #4b5563
  - Gray-700: #374151
  - Gray-800: #1f2937
  - Gray-900: #111827

### Semantic Colors
- **Success**: Green-600 (#16a34a)
- **Warning**: Amber-600 (#d97706)
- **Error**: Red-600 (#dc2626)
- **Info**: Blue-600 (#2563eb)

### Background Colors
- **Background**: White (#ffffff) or Gray-50
- **Surface**: White with subtle shadow
- **Muted**: Gray-50 or Gray-100

## Spacing Scale
Use Tailwind's spacing scale consistently:
- **xs**: 0.5rem (8px)
- **sm**: 0.75rem (12px)
- **base**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## Components

### Buttons

#### Primary Button
```tsx
className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium 
           hover:bg-primary-700 focus:outline-none focus:ring-2 
           focus:ring-primary-500 focus:ring-offset-2 transition-colors 
           disabled:opacity-50 disabled:cursor-not-allowed"
```

#### Secondary Button
```tsx
className="px-4 py-2 bg-white text-gray-700 border border-gray-300 
           rounded-lg font-medium hover:bg-gray-50 focus:outline-none 
           focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
           transition-colors"
```

#### Ghost Button
```tsx
className="px-4 py-2 text-gray-700 rounded-lg font-medium 
           hover:bg-gray-100 focus:outline-none focus:ring-2 
           focus:ring-primary-500 focus:ring-offset-2 transition-colors"
```

### Cards
```tsx
className="bg-white rounded-lg shadow-sm border border-gray-200 
           p-6 hover:shadow-md transition-shadow"
```

### Input Fields
```tsx
className="w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-primary-500 
           focus:border-transparent transition-all"
```

### Form Labels
```tsx
className="block text-sm font-medium text-gray-700 mb-2"
```

## Layout Patterns

### Container
- Max width: 1280px (7xl)
- Padding: px-4 sm:px-6 lg:px-8
- Centered with mx-auto

### Grid System
- Use CSS Grid or Flexbox
- Responsive: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop

### Card Grid
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

## Shadows
- **sm**: shadow-sm - Subtle elevation
- **md**: shadow-md - Cards, modals
- **lg**: shadow-lg - Dropdowns, popovers
- **xl**: shadow-xl - Modals, dialogs

## Border Radius
- **sm**: rounded-sm (2px)
- **base**: rounded (4px)
- **md**: rounded-md (6px)
- **lg**: rounded-lg (8px)
- **xl**: rounded-xl (12px)
- **full**: rounded-full - Pills, avatars

## Animations
- **Minimal only**: Subtle hover/focus effects
- **Duration**: 150ms - 200ms transitions
- **Easing**: ease-in-out
- **No auto-animations**: Only on user interaction

## Accessibility

### Focus States
- Always visible focus rings
- Use ring-2 ring-primary-500 ring-offset-2
- Ensure sufficient contrast (WCAG AA minimum)

### ARIA Labels
- Use semantic HTML
- Add aria-label for icon-only buttons
- Proper heading hierarchy (h1 → h2 → h3)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order should be logical
- Skip links for main content

## Examples

### Page Layout
```tsx
<div className="min-h-screen bg-gray-50">
  <header className="bg-white border-b border-gray-200">
    {/* Header content */}
  </header>
  <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Main content */}
  </main>
  <footer className="bg-white border-t border-gray-200 mt-auto">
    {/* Footer content */}
  </footer>
</div>
```

### Section Header
```tsx
<div className="mb-6">
  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
    Section Title
  </h2>
  <p className="text-gray-600">
    Optional description text
  </p>
</div>
```
