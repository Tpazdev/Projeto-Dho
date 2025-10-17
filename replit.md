# Employee Termination Management System

## Overview

A comprehensive web application designed to streamline HR workflows in Portuguese (Brazilian) for managing employee termination processes, experience evaluations, climate surveys, training/development programs, and Individual Development Plans (PDI). The system provides dashboard analytics, detailed record-keeping, and supports both employee-initiated and company-initiated terminations across different companies, managers, and employees. The core purpose is to enhance HR efficiency through robust data visualization and reporting features for critical HR functions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript using Vite. It utilizes Shadcn UI with Radix UI primitives for a consistent design system, styled with Tailwind CSS. Wouter handles client-side routing, and TanStack Query manages server state. Form handling is implemented with React Hook Form and Zod for validation. The UI/UX prioritizes a professional corporate aesthetic with a dark-mode first approach, consistent typography using the Inter font family, and chart visualizations for analytics.

### Backend Architecture

The backend is an Express.js (Node.js) application exposing RESTful APIs. It includes middleware for JSON parsing, request logging, and centralized error handling. A storage abstraction layer is in place. The system provides comprehensive APIs for managing companies, managers, employees, terminations, experience evaluations, climate surveys, training programs, individual development plans (PDIs), and a dedicated system for creating and managing termination questionnaires.

### Data Architecture

The system uses a PostgreSQL database, managed with Drizzle ORM for type-safe schema definitions and migrations. It employs a normalized relational structure with tables for:
- **Authentication**: `usuarios`, `sessoes_tokens`
- **Core Entities**: `empresas`, `gestores`, `funcionarios`
- **Terminations**: `desligamentos`, `questionariosDesligamento`, `perguntasDesligamento`, `respostasDesligamento`
- **Evaluations**: `formulariosExperiencia` (with two-period support)
- **Climate**: `pesquisasClima`, `perguntasClima`, `respostasClima`
- **Development**: `treinamentos`, `participantesTreinamento`, `pdis`, `metasPDI`, `competenciasPDI`, `acoesPDI`
- **Documents**: `documentosFuncionario`, `documentosGestor`

### Key Features and Implementations

- **User Authentication and Access Control**: Secure JWT-based authentication with role-based access control (Admin, Gestor, Funcionario), refresh token rotation, and robust middleware protection.
- **Internal Termination Questionnaires**: Platform-based forms with dynamic question rendering, supporting various question types (text, multiple choice, scale, date), and token-based public access for employees.
- **Experience Evaluation Period Management**: Two distinct evaluation periods (30 and 60 days) for probationary employees, with list/table layouts for pending and filled evaluations. Includes customizable question system with in-page management - admins can add text-based questions directly from the evaluation pages without accessing a separate configuration screen.
- **Training Effectiveness Evaluation**: Submenu for evaluating completed training programs, tracking participant evaluations, and visual status badges.
- **Customizable Experience Evaluation Questions**: Database-backed system with templates_avaliacao_experiencia and campos_avaliacao_experiencia tables supporting 5 field types (texto, número, escala 1-10, múltipla escolha, sim/não). Admins can add, edit, and view questions directly within the evaluation period pages via an "Adicionar Pergunta" button.

## External Dependencies

### Third-Party Services

- **Neon Database**: Serverless PostgreSQL hosting.
- **Google Fonts**: Inter font family.
- **Microsoft Forms**: Integrated for experience evaluation forms only. A single URL is used: `https://forms.office.com/pages/responsepage.aspx?id=fKhs6GEk4keMILRXyHexKD9hUGoTJTBAh3e6AfxsqZRUREcxQzk3SUJNMkFYMVVKWE04R1IzRjJNUSQlQCN0PWcu&route=shorturl`.
  - **Note**: Termination questionnaires are now handled internally via platform-based forms, not Microsoft Forms.
- **Email Integration**: Email functionality is configured in `server/email.ts` but requires SMTP credentials or an email service API key to be fully functional. The user declined Replit's Resend integration.

### UI Component Libraries

- **Radix UI Primitives**: For headless UI components.
- **Recharts**: For data visualization and charting.

### Utility Libraries

- **clsx** + **tailwind-merge**: For conditional CSS class management.
- **date-fns**: For date formatting and manipulation.
- **class-variance-authority**: For type-safe component variant management.
- **cmdk**: For command palette functionality.
- **embla-carousel-react**: For carousel features.
- **nanoid**: For unique ID generation.