# Employee Termination Management System

## Overview

A comprehensive web application for managing employee termination processes, experience evaluations, climate surveys, training/development programs, and Individual Development Plans (PDI) in Portuguese (Brazilian). The system tracks terminations (desligamentos) across companies, managers (gestores), and employees (funcionários), providing dashboard analytics and detailed record-keeping capabilities.

**Core Purpose**: Streamline HR workflows for employee termination tracking, probation period evaluations, climate assessment, training management, and individual development planning with data visualization and reporting features.

**Tech Stack**:
- Frontend: React + TypeScript with Vite
- Backend: Express.js (Node.js)
- Database: PostgreSQL via Neon serverless
- ORM: Drizzle ORM
- UI Framework: Shadcn UI with Radix UI primitives
- Styling: Tailwind CSS
- State Management: TanStack Query (React Query)
- Routing: Wouter

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

### Termination Interview Management (October 2025)
- **Categorized Terminations**: Added `tipoDesligamento` field to distinguish between employee-initiated ("funcionario") and company-initiated ("gestor") terminations
- **Submenu Navigation**: Implemented expandable Desligamentos menu with two categories:
  - "Entrevista de desligamento – por parte do colaborador" (Employee-initiated)
  - "Entrevista de desligamento – por parte da empresa" (Company-initiated)
- **Employee Search & Questionnaire**: New component `EnviarQuestionario` enables:
  - Real-time search/filter of employees by name or position
  - Direct questionnaire sending to employee email
  - Prepared for email service integration (Gmail, SendGrid, Resend, or Outlook)
  - Currently logs requests to console (email integration pending configuration)

## System Architecture

### Frontend Architecture

**Component Structure**:
- **Design System**: Shadcn UI component library with customized "New York" style variant
- **Routing**: Client-side routing using Wouter (lightweight alternative to React Router)
- **State Management**: TanStack Query for server state with custom query client configuration
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers
- **Theme System**: Custom dark/light mode provider with localStorage persistence

**Key Design Decisions**:
- Monorepo structure with shared TypeScript types between client and server (`shared/schema.ts`)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)
- Component organization: UI primitives in `/ui`, business components at root level
- Responsive design with mobile-first breakpoints

**UI/UX Approach**:
- Professional corporate aesthetic prioritizing data clarity
- Dark mode as primary theme (design_guidelines.md specifies dark-first approach)
- Consistent spacing and typography using Inter font family
- Chart visualizations for termination analytics

### Backend Architecture

**API Structure**:
- RESTful endpoints under `/api` prefix
- Express.js middleware for JSON parsing and request logging
- Storage abstraction layer (`IStorage` interface in `server/storage.ts`)
- Centralized error handling middleware

**Key Endpoints**:
- `/api/empresas` - Company management (GET, POST)
- `/api/gestores` - Manager management (GET, POST)
- `/api/funcionarios` - Employee management (GET, POST)
- `/api/desligamentos` - Termination records (GET, POST)
- `/api/enviar-questionario` - Send termination questionnaire by email (POST)
- `/api/dados/*` - Aggregated analytics endpoints
- `/api/pdis` - Individual Development Plans (GET, POST)
- `/api/pdis/:id/metas` - PDI goals management (GET, POST)
- `/api/pdis/:id/competencias` - PDI competencies management (GET, POST)
- `/api/pdis/:id/acoes` - PDI actions management (GET, POST)
- `/api/pdi-metas/:id` - Update/delete PDI goals (PATCH, DELETE)
- `/api/pdi-competencias/:id` - Update/delete PDI competencies (PATCH, DELETE)
- `/api/pdi-acoes/:id` - Update/delete PDI actions (PATCH, DELETE)

**Database Layer**:
- Drizzle ORM with type-safe schema definitions
- Connection pooling via Neon serverless driver
- Migration system using `drizzle-kit`
- Schema-first approach with Zod validation generated from Drizzle schemas

### Data Architecture

**Database Schema** (PostgreSQL):

1. **empresas** (Companies)
   - `id`: Auto-incrementing primary key
   - `nome`: Unique company name (text, required)

2. **gestores** (Managers)
   - `id`: Auto-incrementing primary key
   - `nome`: Manager name (text, required)
   - `empresaId`: Foreign key to empresas

3. **funcionarios** (Employees)
   - `id`: Auto-incrementing primary key
   - `nome`: Employee name (text, required)
   - `cargo`: Position/role (text, optional)
   - `gestorId`: Foreign key to gestores

4. **desligamentos** (Terminations)
   - `id`: Auto-incrementing primary key
   - `dataDesligamento`: Termination date (date, required)
   - `motivo`: Termination reason (text, optional)
   - `tipoDesligamento`: Termination type (text, required, default: "gestor") - Values: "funcionario" (employee-initiated) or "gestor" (company-initiated)
   - `funcionarioId`: Foreign key to funcionarios
   - `empresaId`: Foreign key to empresas
   - `gestorId`: Foreign key to gestores

5. **formulariosExperiencia** (Experience Evaluation Forms)
   - `id`: Auto-incrementing primary key
   - `funcionarioId`: Foreign key to funcionarios
   - `gestorId`: Foreign key to gestores
   - `dataLimite`: Deadline for completion (date, required)
   - `status`: Form status (pendente, preenchido, aprovado, reprovado)
   - `dataPreenchimento`: Completion date (date, optional)
   - `desempenho`: Performance rating 0-10 (integer, optional)
   - `pontosFortes`, `pontosMelhoria`: Evaluation text fields
   - `recomendacao`: Final recommendation (text, optional)
   - `observacoes`: Additional observations (text, optional)

6. **pesquisasClima** (Climate Surveys)
   - `id`: Auto-incrementing primary key
   - `titulo`: Survey title (text, required)
   - `descricao`: Description (text, optional)
   - `dataInicio`, `dataFim`: Survey period (dates, required)
   - `status`: Survey status (ativa, encerrada)
   - `anonima`: Boolean flag for anonymity (integer)
   - `empresaId`: Foreign key to empresas (optional)

7. **perguntasClima** (Climate Survey Questions)
   - `id`: Auto-incrementing primary key
   - `pesquisaId`: Foreign key to pesquisasClima
   - `texto`: Question text (text, required)
   - `tipo`: Question type (escala, multipla_escolha, texto_livre)
   - `opcoes`: Array of options for multiple choice (text[])
   - `ordem`: Display order (integer)
   - `obrigatoria`: Required flag (integer)

8. **respostasClima** (Climate Survey Responses)
   - `id`: Auto-incrementing primary key
   - `pesquisaId`: Foreign key to pesquisasClima
   - `perguntaId`: Foreign key to perguntasClima
   - `funcionarioId`: Foreign key to funcionarios (nullable for anonymous)
   - `valorEscala`: Scale value 1-10 (integer, optional)
   - `textoResposta`: Text response (text, optional)
   - `dataResposta`: Response date (date, required)

9. **treinamentos** (Training Programs)
   - `id`: Auto-incrementing primary key
   - `titulo`: Training title (text, required)
   - `tipo`: Training type (onboarding, tecnico, comportamental)
   - `descricao`: Description (text, optional)
   - `gestorId`: Foreign key to gestores (responsible manager)
   - `dataInicio`, `dataFim`: Training period (dates, required)
   - `cargaHoraria`: Total hours (integer, optional)
   - `status`: Training status (planejado, em_andamento, concluido)

10. **treinamentoParticipantes** (Training Participants)
    - `id`: Auto-incrementing primary key
    - `treinamentoId`: Foreign key to treinamentos
    - `funcionarioId`: Foreign key to funcionarios
    - `status`: Participant status (inscrito, em_progresso, concluido, reprovado)
    - `dataInscricao`: Enrollment date (date, required)
    - `dataConclusao`: Completion date (date, optional)
    - `avaliacaoNota`: Final grade 0-10 (integer, optional)
    - `observacoes`: Evaluation notes (text, optional)

11. **pdis** (Individual Development Plans)
    - `id`: Auto-incrementing primary key
    - `funcionarioId`: Foreign key to funcionarios
    - `gestorId`: Foreign key to gestores
    - `dataInicio`, `dataFim`: Plan period (dates, required)
    - `status`: Plan status (em_elaboracao, em_andamento, concluido)
    - `observacoes`: General notes (text, optional)

12. **pdiMetas** (PDI Goals)
    - `id`: Auto-incrementing primary key
    - `pdiId`: Foreign key to pdis
    - `descricao`: Goal description (text, required)
    - `prazo`: Deadline (date, required)
    - `status`: Goal status (pendente, em_andamento, concluido)
    - `resultado`: Outcome description (text, optional)

13. **pdiCompetencias** (PDI Competencies)
    - `id`: Auto-incrementing primary key
    - `pdiId`: Foreign key to pdis
    - `competencia`: Competency name (text, required)
    - `nivelAtual`: Current proficiency level 1-10 (integer, required)
    - `nivelDesejado`: Target proficiency level 1-10 (integer, required)
    - `observacoes`: Development notes (text, optional)

14. **pdiAcoes** (PDI Development Actions)
    - `id`: Auto-incrementing primary key
    - `pdiId`: Foreign key to pdis
    - `acao`: Action description (text, required)
    - `tipo`: Action type (treinamento, mentoria, projeto, leitura, curso, outro)
    - `prazo`: Deadline (date, required)
    - `status`: Action status (pendente, em_andamento, concluido)
    - `resultado`: Outcome description (text, optional)

**Design Patterns**:
- Normalized relational structure with referential integrity
- Denormalized views for dashboard queries (computed joins)
- Type safety through Drizzle schema → Zod → TypeScript pipeline

### Development Workflow

**Build Process**:
- `npm run dev`: Development mode with Vite HMR and tsx server watch
- `npm run build`: Vite client build + esbuild server bundle
- `npm run start`: Production server serving static assets
- `npm run db:push`: Schema migration to database

**Development Features**:
- Vite middleware integration for HMR in development
- Runtime error overlay via @replit/vite-plugin-runtime-error-modal
- Source mapping for debugging
- Auto-reload on server changes

## External Dependencies

### Third-Party Services

1. **Neon Database** (PostgreSQL)
   - Serverless PostgreSQL hosting
   - WebSocket-based connection via `@neondatabase/serverless`
   - Configured via `DATABASE_URL` environment variable
   - Required for all database operations

2. **Google Fonts**
   - Inter font family loaded via CDN
   - Used for all typography (UI and display text)

### UI Component Libraries

**Radix UI Primitives** (Headless components):
- Dialog, Popover, Select, Dropdown Menu
- Accordion, Tabs, Toast notifications
- Checkbox, Radio Group, Switch
- Tooltip, Hover Card, Context Menu
- Navigation Menu, Menubar, Sidebar primitives

**Charting Library**:
- Recharts for data visualization
- Bar charts for termination analytics
- Custom chart container with theme integration

### Development Dependencies

**Build Tools**:
- Vite: Frontend build tool and dev server
- esbuild: Server-side bundling
- tsx: TypeScript execution for development
- PostCSS with Tailwind and Autoprefixer

**Replit Integrations**:
- `@replit/vite-plugin-cartographer`: Code mapping
- `@replit/vite-plugin-dev-banner`: Development environment indicator
- Custom runtime error modal for debugging

### Utility Libraries

- `clsx` + `tailwind-merge`: Conditional className utilities
- `date-fns`: Date formatting and manipulation (pt-BR locale support)
- `class-variance-authority`: Type-safe variant management for components
- `cmdk`: Command palette component base
- `embla-carousel-react`: Carousel functionality
- `nanoid`: Unique ID generation