# Employee Termination Management System

## Overview

A comprehensive web application designed to streamline HR workflows in Portuguese (Brazilian) for managing employee termination processes, experience evaluations, climate surveys, training/development programs, and Individual Development Plans (PDI). The system provides dashboard analytics, detailed record-keeping, and supports both employee-initiated and company-initiated terminations across different companies, managers, and employees. The core purpose is to enhance HR efficiency through robust data visualization and reporting features for critical HR functions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

### User Authentication and Access Control (October 2025)
- **Complete Authentication System**: Implemented secure JWT-based authentication with role-based access control
- **User Roles**: Three distinct roles with different permission levels:
  - **Admin**: Full platform visibility but cannot fill questionnaires or forms (read-only for submissions)
  - **Gestor** (Manager): Can manage teams, fill manager-specific forms and questionnaires
  - **Funcionario** (Employee): Can fill employee-specific forms and questionnaires
- **Security Features**:
  - JWT access tokens (15 minutes expiration) stored in httpOnly cookies
  - Rotating refresh tokens (30 days expiration) for enhanced security
  - Automatic token refresh every 14 minutes to maintain session
  - Password hashing with bcrypt (10 salt rounds)
  - Token rotation on each refresh to prevent replay attacks
  - 78+ API routes protected with `requireAuth` middleware
- **Backend Protection**:
  - `requireAuth` middleware: Verifies authentication for all protected routes
  - `requireNotAdmin` middleware: Blocks Admin from POST routes for questionnaires/forms
  - Returns clear 403 error messages when access is denied
  - All auth routes: /api/auth/login, /api/auth/logout, /api/auth/refresh, /api/auth/me
- **Frontend Features**:
  - AuthContext manages global authentication state
  - Automatic redirect to /login for unauthenticated users
  - Route guards prevent unauthorized access
  - Visual indicators (yellow warning banners) when Admin views submission pages
  - Submit buttons disabled for Admin users with clear messaging
  - Loading states during authentication verification
- **User Experience**:
  - Seamless session management with auto-refresh
  - No interruption during active use (14-minute refresh interval)
  - Clear visual feedback about role restrictions
  - Role-based menu visibility - Admin-only items hidden from other users
- **Default Admin Users**:
  - admin@sistema.com (password: admin123)
  - tpazdev@gmail.com (password: 123456)

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

### Filled Termination Questionnaires Viewing (October 2025)
- **Admin-Only Feature**: Allows Admin users to view filled termination questionnaires
- **Security Implementation**:
  - Backend routes protected with `requireRole(["admin"])`
  - Frontend route guards redirect non-admin users to dashboard
  - Error handling displays permission messages for unauthorized access
  - Menu items hidden from non-admin users via adminOnly flag
- **Navigation**:
  - Nested within "Desligamentos" menu as a collapsible sub-item
  - "Questionários Preenchidos" appears below the two interview options (Admin-only)
  - Two nested links:
    - `/questionarios-preenchidos/funcionario` - View employee-initiated questionnaires
    - `/questionarios-preenchidos/gestor` - View company-initiated questionnaires
- **Features**:
  - Lists desligamentos that have submitted questionnaire responses
  - Search functionality to filter by employee name or position
  - Dialog interface to view detailed question-answer pairs
  - Displays text responses, scale values (1-10), and response dates
  - Shows employee, manager, and termination date context
- **API Endpoints** (All Admin-only):
  - GET `/api/desligamentos-com-respostas` - Returns unique desligamento IDs with responses
  - GET `/api/respostas-desligamento/:desligamentoId` - Returns all responses for a specific termination
- **Database**:
  - New `getDesligamentosComRespostas()` storage method returns distinct desligamentoIds
  - Optimized queries to avoid redundant data
- **Bug Fixes**:
  - Corrected question field reference from `texto` to `pergunta` (matches database schema)

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

The system uses a PostgreSQL database, managed with Drizzle ORM for type-safe schema definitions and migrations. It employs a normalized relational structure with tables for:
- **Authentication**: `usuarios` (Users with roles), `sessoes_tokens` (Session management with refresh tokens)
- **Core Entities**: `empresas` (Companies), `gestores` (Managers), `funcionarios` (Employees)
- **Terminations**: `desligamentos` (Terminations), `questionariosDesligamento` (Termination Questionnaires), `perguntasDesligamento` (Questionnaire Questions), `respostasDesligamento` (Questionnaire Responses)
- **Evaluations**: `formulariosExperiencia` (Experience Evaluation Forms) with two-period support
- **Climate**: `pesquisasClima` (Climate Surveys), `perguntasClima` (Survey Questions), `respostasClima` (Survey Responses)
- **Development**: `treinamentos` (Training Programs), `participantesTreinamento` (Participants), `pdis` (Individual Development Plans), `metasPDI` (PDI Goals), `competenciasPDI` (PDI Competencies), `acoesPDI` (PDI Actions)
- **Documents**: `documentosFuncionario` (Employee Documents), `documentosGestor` (Manager Documents)

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