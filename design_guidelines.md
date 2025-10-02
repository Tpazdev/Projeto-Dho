# Design Guidelines: Employee Termination Management System

## Design Approach

**Selected Approach:** Design System (Shadcn UI + Modern Dashboard Patterns)

**Justification:** As a data-intensive HR management tool focused on efficiency, accuracy, and professional workflows, this system requires a robust, consistent design system. The application prioritizes clear data presentation, efficient form completion, and quick dashboard comprehension over visual flair.

**Key Design Principles:**
- Clarity over decoration: Every element serves a functional purpose
- Professional restraint: Corporate-appropriate aesthetics
- Data-first hierarchy: Information architecture optimized for quick scanning
- Workflow efficiency: Minimize clicks and cognitive load for repetitive tasks

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 222 47% 11% (deep charcoal)
- Surface: 217 33% 17% (dark slate)
- Primary: 217 91% 60% (professional blue)
- Accent: 142 71% 45% (success green - use sparingly for positive actions)
- Destructive: 0 72% 51% (alert red - for termination warnings)
- Muted Text: 215 20% 65%

**Light Mode:**
- Background: 0 0% 100% (white)
- Surface: 240 5% 96% (light gray)
- Primary: 217 91% 60% (consistent blue)
- Accent: 142 71% 45%
- Destructive: 0 72% 51%
- Text: 222 47% 11%

**Semantic Colors:**
- Chart Colors: Use distinct hues - 217 91% 60% (blue), 142 71% 45% (green), 45 93% 47% (amber), 262 83% 58% (purple)
- Status Indicators: Green for active, Red for terminated, Amber for pending

### B. Typography

**Font Families:**
- Primary: 'Inter' (via Google Fonts) - for UI elements, forms, tables
- Display: 'Inter' with increased letter-spacing for headings

**Type Scale:**
- Page Titles: text-3xl font-bold (dashboard headings)
- Section Headers: text-2xl font-semibold
- Card Titles: text-lg font-semibold
- Body/Table Text: text-sm font-normal
- Labels: text-sm font-medium
- Captions: text-xs text-muted-foreground

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12 for consistency
- Component Padding: p-6 (cards, modals)
- Section Spacing: space-y-6 or gap-6
- Page Margins: px-4 md:px-8
- Tight Spacing: gap-4 (form fields)
- Generous Spacing: gap-8 (between major sections)

**Grid Structure:**
- Dashboard: 12-column grid with responsive breakpoints
- Tables: Full-width with horizontal scroll on mobile
- Forms: Single column on mobile, 2-column on md+ breakpoints
- Max Container Width: max-w-7xl mx-auto

### D. Component Library

**Navigation:**
- Top Navigation Bar: Fixed header with logo, primary nav items, user profile dropdown
- Breadcrumbs: Show current location (Dashboard > Desligamentos > Novo)
- Sidebar (Optional): Collapsible on mobile with main sections (Dashboard, Desligamentos, Cadastros)

**Data Tables:**
- Shadcn Table component with alternating row backgrounds
- Sticky header on scroll
- Action column (right-aligned) with icon buttons for edit/delete
- Hover state: subtle background change
- Pagination controls at bottom-right
- Sort indicators on column headers
- Row selection checkboxes for batch operations

**Forms:**
- Shadcn Form components with clear label-input pairing
- Dropdown Selects: Search-enabled for large lists (employees, managers)
- Date Picker: Calendar popup with keyboard navigation
- Required field indicators: Red asterisk on labels
- Validation: Inline error messages below fields in destructive color
- Form Actions: Primary button (right-aligned) + Cancel link (left)

**Cards:**
- Dashboard stat cards: p-6 with icon, large number, label, trend indicator
- Bordered cards with subtle shadow: border rounded-lg shadow-sm
- Metric Cards: Display KPIs (Total Desligamentos, Por Mês, etc.)

**Charts (Using Shadcn Chart Components):**
- Bar Charts: Primary for manager/company comparisons
- Consistent color mapping across charts
- Tooltips on hover showing exact values
- Legend positioned at top-right
- Axis labels in muted text color
- Grid lines: subtle, dashed
- Chart Container: Card wrapper with title and description

**Buttons:**
- Primary: Default Shadcn button styling (solid fill)
- Secondary: variant="outline" for cancel actions
- Destructive: variant="destructive" for delete confirmations
- Ghost: variant="ghost" for table row actions
- Icon Buttons: Square, 40px with centered icon

**Modals/Dialogs:**
- Shadcn Dialog component for confirmations
- Delete Confirmation: Show affected records before deletion
- Max width: max-w-md for confirmations, max-w-2xl for complex forms

**Badges:**
- Status badges using Shadcn Badge component
- Empresa badge: subtle background with company name
- Role badge: for cargo display in tables

### E. Page-Specific Layouts

**Main Page (/) - Terminations Table:**
- Page header with title "Gestão de Desligamentos" + "Novo Desligamento" button (top-right)
- Filter controls above table: Date range picker, company filter, manager filter
- Table with columns: Funcionário, Cargo, Gestor, Empresa, Data do Desligamento, Ações
- Pagination: Show "Mostrando 1-10 de 45 registros"

**Dashboard (/dashboard):**
- Grid of metric cards at top (4 columns on lg, 2 on md, 1 on mobile)
- Chart section: 2-column grid for side-by-side comparison
- Each chart in a Card component with header
- Responsive: Stack charts vertically on mobile

**Form Pages (/desligamento/novo):**
- Centered form with max-w-2xl
- Card container with title at top
- Field groups with space-y-4
- Submit button with loading state
- Toast notifications for success/error feedback

**CRUD Management Pages:**
- Tabs component for switching between Empresas, Gestores, Funcionários
- Each tab shows table + "Adicionar" button
- Inline editing or modal forms for quick updates

### F. Interaction & Animation

**Minimal Animations:**
- Button hover: subtle background color shift (built-in Shadcn)
- Table row hover: background color change
- Page transitions: None (instant navigation)
- Chart rendering: Fade-in on load (300ms)
- Modal entry: Scale + fade (built-in Radix)

**No Distracting Animations:** Avoid carousel auto-play, parallax scrolling, or complex SVG animations

---

## Images

This application should NOT include large hero images or decorative imagery. It's a business tool focused on data and functionality.

**Icon Usage:**
- Use Lucide React icons (included with Shadcn)
- Navigation icons: 20px size
- Stat card icons: 24px with subtle background circle
- Table action icons: 16px in ghost buttons
- Chart legends: 12px square color indicators

---

## Accessibility & Responsive Behavior

- Maintain dark mode consistency across all form inputs and text fields
- Ensure color contrast ratios meet WCAG AA standards
- Tables: Horizontal scroll container on mobile with sticky first column
- Forms: Stack to single column below md breakpoint
- Charts: Reduce height on mobile, maintain readability
- Touch targets: Minimum 44px for interactive elements on mobile