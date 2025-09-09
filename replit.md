# Louis Amy AE Studio - Interactive Proposal Platform

## Overview

This is a sophisticated web application built for Louis Amy AE Studio that transforms traditional PDF proposals into engaging, interactive client experiences. The platform implements Chris Do's value-based pricing philosophy, enabling HNW clients to explore design options confidently while streamlining internal quote preparation for the architectural engineering team.

The system features a dual architecture: an internal admin calculator for project managers to create accurate quotes using sophisticated building classification formulas, and a premium client-facing proposal interface that presents three strategic pricing tiers without exposing hourly rates or internal calculations.

The pilot project targets Dr. Luis De Jesús's Casa Vista residential remodel in Ponce, PR (4,407 sq ft, $859k construction budget, $137k design fee), demonstrating the platform's capability to handle complex custom residential projects with integrated architectural, structural, civil, and interior design services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Next.js 14** with App Router for modern React server components and optimized routing
- **TypeScript** throughout for type safety and developer experience
- **Tailwind CSS** with shadcn/ui components for consistent, professional design system
- **Mobile-first responsive design** ensuring functionality across all device sizes

### Backend Architecture
- **API Routes** in Next.js for serverless backend functionality
- **Single calculation engine** (`lib/calculations.ts`) with dual-mode calibration (EXCEL/SSOT modes)
- **Database service layer** (`lib/db/construction-costs.ts`) for accessing building classification data
- **React hooks** (`lib/hooks/useBuildingClassification.ts`) for stateful building selection management

### Data Storage Solutions
- **Supabase PostgreSQL** database for construction cost indices, project proposals, and client tracking
- **Comprehensive schema** with building uses, types, tiers, cost ranges, and engineering discipline shares
- **Fallback system** with CSV-based data when database is unavailable
- **Proposal tokens** for secure, shareable client links

### Authentication and Authorization
- **Token-based proposal access** using unique UUIDs for client proposal security
- **No authentication required** for client proposal viewing (frictionless experience)
- **Admin tool protection** through environment configuration
- **Service role access** for database operations

### External Service Integrations
- **3D Model Integration** with Nira platform for interactive building visualizations
- **QR Code generation** for mobile-friendly proposal sharing
- **Email capabilities** (configurable) for proposal notifications
- **Recharts visualization** for budget allocation displays

## External Dependencies

### Core Dependencies
- **Supabase** - Primary database and backend services
- **shadcn/ui + Radix UI** - Component library for professional interface elements
- **Lucide React** - Icon system for consistent visual language
- **Recharts** - Chart library for budget visualization donut charts

### Optional Integrations
- **Nira 3D Platform** - For hosting and embedding interactive 3D building models
- **SMTP Services** - For email notifications (Gmail, SendGrid, or similar)
- **Vercel** - Recommended deployment platform for Next.js optimization

### Development Tools
- **Jest + Testing Library** - Test suite for calculation validation
- **TypeScript** - Type checking and developer tooling
- **ESLint** - Code quality and consistency
- **CSV parsing** - For construction cost data import and fallback systems

The application uses a sophisticated calibration system that can switch between "EXCEL" mode (matching original spreadsheet formulas) and "SSOT" mode (optimized app constants) to ensure mathematical accuracy across different project requirements while maintaining flexibility for future scaling.