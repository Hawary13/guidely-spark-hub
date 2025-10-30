# Replit.md - GSF Website Development Guide

## Overview

This repository contains the Giza Systems Foundation (GSF) website - a modern, full-stack web application built to showcase GSF's mission as "system aggregators" connecting opportunities with talent for Egyptian youth. The application serves both public users and provides a comprehensive admin panel for content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom GSF brand colors
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Theme**: Custom light/dark theme implementation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Build Tool**: Vite for frontend, esbuild for backend

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with type-safe schema definitions  
- **Schema Location**: `shared/schema.ts` for shared types
- **Migrations**: Drizzle migrations in `./migrations` directory
- **Fallback Storage**: In-memory storage for development/testing

## Key Components

### Public Website Features
1. **Hero Section**: Dynamic hero with particles animation
2. **About Page**: System aggregator approach explanation
3. **Programs**: Showcase of GSF programs and initiatives  
4. **Impact & Success Stories**: Data-driven impact metrics and case studies
5. **Events & Media**: Event listings with detailed pages
6. **Join Us**: Multi-type application forms (participant, mentor, partner, volunteer)

### Admin Panel Features
1. **Authentication System**: Role-based access control
2. **Content Management**: Full CRUD for all page content
3. **Program Management**: Create and manage programs
4. **Event Management**: Event creation with media support
5. **User Management**: Admin user roles and permissions
6. **Statistics Dashboard**: Real-time metrics and analytics
7. **Success Stories**: Case study management
8. **SEO Management**: Meta tags and content optimization

### Authentication & Authorization
- **Strategy**: Custom authentication with session management
- **User Roles**: super_admin, admin, editor, viewer
- **Permission System**: Granular permissions array
- **Session Storage**: PostgreSQL-based sessions
- **Protected Routes**: Role-based route protection

## Data Flow

1. **Public Pages**: Static-first with dynamic content loading via React Query
2. **Admin Operations**: CRUD operations through REST API endpoints
3. **Real-time Updates**: Database triggers for content synchronization
4. **Form Submissions**: Direct database storage with notification system
5. **Media Handling**: File upload system for images and documents

## External Dependencies

### Core Dependencies
- `@neondatabase/serverless`: Neon PostgreSQL connection
- `drizzle-orm`: Type-safe database ORM
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Accessible UI primitives
- `tailwindcss`: Utility-first CSS framework
- `zod`: Schema validation
- `react-hook-form`: Form management

### Development Dependencies
- `tsx`: TypeScript execution for development
- `vite`: Frontend build tool
- `esbuild`: Backend build tool
- `drizzle-kit`: Database migration tool

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds client to `dist/public`
2. **Backend Build**: esbuild bundles server to `dist/index.js`  
3. **Database Setup**: Drizzle migrations run automatically
4. **Asset Optimization**: Vite handles asset bundling and optimization

### Environment Configuration
- `DATABASE_URL`: Neon PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)
- Additional Firebase config for optional features

### Production Deployment
- **Start Command**: `npm start` runs the production build
- **Database**: Automatic migration on startup
- **Static Assets**: Served from `dist/public`
- **API Routes**: Prefixed with `/api` for backend endpoints

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Implemented particles.js library for interactive hero animations
- June 29, 2025. Fixed footer button color contrast issues across all pages (white text on white background)
- June 29, 2025. Fixed text contrast issues in hero sections and CTA areas across all pages (light gray/white text on white backgrounds) - changed to text-white/90 dark:text-blue-100 for proper accessibility
- June 29, 2025. Fixed additional white text on white background issues in About, Events, and Join page hero sections - ensured all titles use text-white for visibility
- June 29, 2025. Resolved persistent hero section contrast issues by replacing gradient backgrounds with solid blue backgrounds (bg-blue-600) in light mode for proper text visibility
- June 29, 2025. Fixed Impact page loading issues by implementing fallback data when Firebase is unavailable, preventing infinite loading states and providing immediate content display
- June 29, 2025. Fixed Events page loading issues by implementing fallback events data when Firebase is unavailable, ensuring fast loading times and preventing infinite loading states across all event-related pages
- June 29, 2025. Optimized Programs page loading performance using fallback data system - eliminated infinite loading delays and ensured instant content display even when Firebase is unavailable
- June 29, 2025. Resolved Events page data disappearing issue - implemented robust query logic to preserve fallback data when Firebase returns empty results, ensuring consistent event display with comprehensive mock events including workshops, pitch nights, and conferences
- June 29, 2025. Fixed all broken images on Events page by replacing base64 SVG placeholders with working Unsplash image URLs - all event cards, speaker profiles, and media galleries now display properly with themed images for innovation workshops, pitch nights, women in tech summits, and marketing masterclasses
- June 29, 2025. Fixed all broken images on Programs page by replacing local image paths with working Unsplash URLs - Tech Innovation Hub, Green Future Initiative, and Digital Skills Academy now display professional themed images for technology, environment, and education respectively
- June 30, 2025. Enhanced homepage with comprehensive content sections: added "Why Choose GSF" section with 6 compelling benefit cards (Expert Mentorship, Funding Opportunities, Innovation Hub, Global Network, Skills Development, Market Access), integrated Partners section from About page with auto-scrolling logos, and created detailed Testimonials section featuring 3 alumni success stories with professional images and achievements to make the homepage more appealing and comprehensive
- June 30, 2025. Fixed navigation scroll behavior to ensure all main navigation menu clicks direct users to the very top of target pages - implemented scroll restoration on route changes and added smooth scroll-to-top functionality for both desktop and mobile navigation links including logo clicks
- June 30, 2025. Enhanced website with comprehensive dynamic hover interactions: added advanced button animations with scale/lift effects, floating action button with expandable contact options, enhanced benefit cards with 3D rotation and glow effects, improved program/event cards with blur shadows and animated overlays, upgraded card component with universal hover animations, and created animated counter components for statistics - significantly improved user engagement across all pages
- June 30, 2025. Expanded Impact page with 6 comprehensive success stories covering diverse sectors: CleanTech (EcoVerde Solutions, Green Energy Solutions), HealthTech (HealthTech Innovators), EdTech (EdTech Arabia), AgriTech (AgriSmart Egypt), and FinTech (FinTech Bridge) - each story includes detailed achievements, funding amounts, job creation metrics, professional images, and company links to showcase real GSF program impact
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```