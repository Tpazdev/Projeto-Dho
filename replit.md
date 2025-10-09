# Employee Termination Management System

## Overview

A comprehensive web application designed to streamline HR workflows in Portuguese (Brazilian) for managing employee termination processes, experience evaluations, climate surveys, training/development programs, and Individual Development Plans (PDI). The system provides dashboard analytics, detailed record-keeping, and supports both employee-initiated and company-initiated terminations across different companies, managers, and employees. The core purpose is to enhance HR efficiency through robust data visualization and reporting features for critical HR functions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

### Experience Evaluation Period Management (October 2025)
- **Two-Period Structure**: Avaliações de Experiência now organized into two separate periods:
  - **01° Período**: First evaluation period for probationary employees
  - **02° Período**: Second evaluation period for probationary employees
- **Database Enhancement**: Added `periodo` field to formulariosExperiencia table (default: "1")
- **Navigation**: Collapsible sidebar menu with two sub-items for easy access to each period
- **Filtering**: Each period shows only its relevant evaluation forms
- **Dedicated Routes**:
  - `/formularios-experiencia/primeiro-periodo` - First period evaluations
  - `/formularios-experiencia/segundo-periodo` - Second period evaluations

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript using Vite. It utilizes Shadcn UI with Radix UI primitives for a consistent design system, styled with Tailwind CSS. Wouter handles client-side routing, and TanStack Query manages server state. Form handling is implemented with React Hook Form and Zod for validation. The UI/UX prioritizes a professional corporate aesthetic with a dark-mode first approach, consistent typography using the Inter font family, and chart visualizations for analytics.

### Backend Architecture

The backend is an Express.js (Node.js) application exposing RESTful APIs. It includes middleware for JSON parsing, request logging, and centralized error handling. A storage abstraction layer is in place. The system provides comprehensive APIs for managing companies, managers, employees, terminations, experience evaluations, climate surveys, training programs, individual development plans (PDIs), and a dedicated system for creating and managing termination questionnaires.

### Data Architecture

The system uses a PostgreSQL database, managed with Drizzle ORM for type-safe schema definitions and migrations. It employs a normalized relational structure with tables for `empresas` (Companies), `gestores` (Managers), `funcionarios` (Employees), `desligamentos` (Terminations), `formulariosExperiencia` (Experience Evaluation Forms), `pesquisasClima` (Climate Surveys) and associated questions/responses, `treinamentos` (Training Programs) and participants, `pdis` (Individual Development Plans) with goals, competencies, and actions, and a comprehensive `questionariosDesligamento` (Termination Questionnaires) system with associated questions.

## External Dependencies

### Third-Party Services

- **Neon Database**: Serverless PostgreSQL hosting for all database operations.
- **Google Fonts**: Inter font family for consistent typography.
- **Microsoft Forms**: Integrated for termination questionnaires with separate forms for different termination types:
  - **Employee-initiated terminations**: https://forms.office.com/pages/responsepage.aspx?id=fKhs6GEk4keMILRXyHexKD9hUGoTJTBAh3e6AfxsqZRUN1NMOEdNUjRLNk9aVFQ0UEFVOVRMMTFJWSQlQCN0PWcu&route=shorturl
  - **Company-initiated terminations**: https://forms.office.com/pages/responsepage.aspx?id=fKhs6GEk4keMILRXyHexKD9hUGoTJTBAh3e6AfxsqZRUMkJPVzBTM1VCN0VNVFg5QjZJTFZPV1YwSyQlQCN0PWcu&route=shorturl
  - System automatically provides the appropriate link based on termination type via dialog interface with copy/open options

### UI Component Libraries

- **Radix UI Primitives**: Headless components for Dialogs, Popovers, Selects, etc.
- **Recharts**: Used for data visualization and charting, especially for termination analytics.

### Development Dependencies

- **Vite**: Frontend build tool and development server.
- **esbuild**: Server-side bundling.
- **tsx**: TypeScript execution for development.
- **PostCSS with Tailwind and Autoprefixer**: For styling and CSS processing.

### Utility Libraries

- **clsx** + **tailwind-merge**: For conditional CSS class management.
- **date-fns**: For date formatting and manipulation, with pt-BR locale support.
- **class-variance-authority**: For type-safe component variant management.
- **cmdk**: For command palette functionality.
- **embla-carousel-react**: For carousel features.
- **nanoid**: For unique ID generation.