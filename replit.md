# Employee Termination Management System

## Overview

A comprehensive web application designed to streamline HR workflows in Portuguese (Brazilian) for managing employee termination processes, experience evaluations, climate surveys, training/development programs, and Individual Development Plans (PDI). The system provides dashboard analytics, detailed record-keeping, and supports both employee-initiated and company-initiated terminations across different companies, managers, and employees. The core purpose is to enhance HR efficiency through robust data visualization and reporting features for critical HR functions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

### Internal Termination Questionnaires (October 2025)
- **Platform-Based Forms**: Termination questionnaires moved from external Microsoft Forms to internal platform forms
- **Database Structure**:
  - `respostasDesligamento` table stores questionnaire responses with references to desligamento, questionario, and pergunta
  - Full support for text, multiple choice, and scale (1-10) question types
  - Mandatory/optional question configuration
- **Navigation**: 
  - Collapsible "Questionários de Desligamento" menu with two sub-items
  - `/questionarios-desligamento/iniciativa-funcionario` - Employee-initiated termination questionnaires
  - `/questionarios-desligamento/iniciativa-empresa` - Company-initiated termination questionnaires
- **User Experience**:
  - Internal dialog-based form filling with dynamic question rendering
  - Validation for required fields before submission
  - Automatic questionnaire selection based on termination type (funcionario/gestor)
  - Searchable desligamento list filtered by type
  - Success toast notification after submission
- **Technical Implementation**:
  - `QuestionarioDesligamentoForm` component handles internal form rendering
  - `EnviarQuestionario` component manages desligamento selection and dialog display
  - API endpoints for fetching active questionnaires and saving responses
  - Support for multiple question types with appropriate UI controls

### Experience Evaluation Period Management (October 2025)
- **Two-Period Structure**: Avaliações de Experiência now organized into two separate periods:
  - **01° Período**: First evaluation period for probationary employees (30 days)
  - **02° Período**: Second evaluation period for probationary employees (60 days)
- **Database Enhancement**: Added `periodo` field to formulariosExperiencia table (default: "1")
- **Navigation**: Collapsible sidebar menu with two sub-items for easy access to each period
- **Filtering**: Each period shows only its relevant evaluation forms
- **Dedicated Routes**:
  - `/formularios-experiencia/primeiro-periodo` - First period evaluations
  - `/formularios-experiencia/segundo-periodo` - Second period evaluations
- **Microsoft Forms Integration**: 
  - External form filling only - no internal evaluation form
  - "Enviar Formulário ao Gestor" button on each pending evaluation form
  - Dialog interface with manager/employee context and period information
  - Single Microsoft Forms URL for all evaluation periods: https://forms.office.com/pages/responsepage.aspx?id=fKhs6GEk4keMILRXyHexKD9hUGoTJTBAh3e6AfxsqZRUREcxQzk3SUJNMkFYMVVKWE04R1IzRjJNUSQlQCN0PWcu&route=shorturl
  - Copy link and open form functionality with toast notifications
- **List/Table Layout**:
  - Converted from card-based to table/list layout for better data visualization
  - **Pendentes table columns**: ID, Nome do Funcionário, Nome do Gestor, Período, Data Limite, Status, Ações
  - **Preenchidos table columns**: ID, Nome do Funcionário, Nome do Gestor, Período, Data Preenchimento, Desempenho, Status
  - Responsive design with horizontal scroll on mobile devices
  - Overdue evaluations highlighted with red background

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
- **Microsoft Forms**: Integrated for experience evaluation forms only:
  - Single Microsoft Forms URL for all evaluation periods: https://forms.office.com/pages/responsepage.aspx?id=fKhs6GEk4keMILRXyHexKD9hUGoTJTBAh3e6AfxsqZRUREcxQzk3SUJNMkFYMVVKWE04R1IzRjJNUSQlQCN0PWcu&route=shorturl
  - Dialog interface with copy/open link functionality
  - **Note**: Termination questionnaires are now handled internally via platform-based forms, no longer using Microsoft Forms

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