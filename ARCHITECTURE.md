# University ERP Frontend Architecture

## Overview
This document outlines the modular frontend architecture for the University ERP system. The architecture follows a senior developer approach with clear separation of concerns, ensuring each module is independent and maintainable.

## Design Principles

### 1. Modular Architecture
- **Feature-based modules**: Each domain (Auth, Core, Academic, Finance, etc.) is a self-contained module
- **Independent deployment**: Changes in one module don't affect others
- **Shared library**: Common components and utilities are centralized
- **Type safety**: Comprehensive TypeScript types for all API contracts

### 2. Directory Structure
```
src/
├── api/                    # API layer
│   ├── axios.ts           # Axios configuration
│   └── services/          # Service modules (one per backend module)
│       ├── authService.ts
│       ├── coreService.ts
│       ├── academicService.ts
│       ├── studentService.ts
│       ├── financeService.ts
│       ├── examService.ts
│       ├── hrService.ts
│       ├── libraryService.ts
│       ├── hostelService.ts
│       ├── transportService.ts
│       └── admissionService.ts
├── components/            # React components
│   ├── shared/           # Reusable components
│   │   ├── forms/       # Form components
│   │   ├── tables/      # Table components
│   │   ├── modals/      # Modal components
│   │   ├── charts/      # Chart components
│   │   └── ui/          # UI primitives
│   └── layout/          # Layout components
├── context/              # React contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── usePagination.ts
│   └── useFilters.ts
├── modules/              # Feature modules (NEW)
│   ├── auth/            # Authentication module
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   ├── university-admin/ # University Admin module
│   ├── college-admin/   # College Admin module
│   ├── faculty/         # Faculty module
│   ├── registrar/       # Registrar module
│   ├── finance/         # Finance Controller module
│   ├── student/         # Student module
│   ├── admissions/      # Admissions module
│   ├── library/         # Library module
│   ├── hostel/          # Hostel module
│   ├── transport/       # Transport module
│   └── hr/              # HR module
├── pages/               # Route pages (legacy, will migrate to modules)
├── types/               # TypeScript types
│   ├── auth.ts
│   ├── core.ts
│   ├── academic.ts
│   ├── student.ts
│   ├── finance.ts
│   ├── exam.ts
│   ├── hr.ts
│   ├── library.ts
│   ├── hostel.ts
│   ├── transport.ts
│   ├── admissions.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── helpers.ts
├── config/              # Configuration files
│   ├── routes.ts
│   ├── permissions.ts
│   └── theme.ts
└── App.tsx              # Root component
```

## Module Structure

Each module follows this structure:
```
modules/[module-name]/
├── components/          # Module-specific components
├── pages/              # Module pages
├── hooks/              # Module-specific hooks
├── services/           # Module-specific API wrappers
├── types/              # Module-specific types
├── constants/          # Module constants
└── index.ts            # Module exports
```

## Role-Based Access Control

### Role Hierarchy
1. **University Admin** (role_id: 1) - Full system access
2. **Finance Controller** (role_id: 2) - Finance operations
3. **Registrar** (role_id: 3) - Exam and academic operations
4. **College Admin** (role_id: 4) - College-level operations
5. **HOD** (role_id: 5) - Department-level operations
6. **Faculty** (role_id: 6) - Teaching and grading
7. **Student** (role_id: 7) - Student portal
8. **Staff** (role_id: 8) - Staff operations

### Permission Matrix
Each role has specific permissions defined in `config/permissions.ts`

## API Integration Strategy

### Service Layer Pattern
- Each backend module has a corresponding service
- Services handle API calls, error handling, and data transformation
- Services use React Query for caching and synchronization
- Centralized error handling in axios interceptor

### Type Safety
- All API requests/responses are typed
- Types mirror backend Go structs
- Zod schemas for runtime validation

## State Management

### Global State (Context API)
- Authentication state
- Theme preferences
- Notification state

### Local State (React Query)
- API data caching
- Automatic refetching
- Optimistic updates

### Component State
- Form state
- UI state (modals, dropdowns, etc.)

## Styling Strategy

### TailwindCSS
- Utility-first CSS framework
- Custom theme in `tailwind.config.js`
- Component classes in `index.css`

### Design System
- Primary color: #650C08 (maroon)
- Secondary colors: defined in theme
- Consistent spacing, typography, and shadows
- Responsive design (mobile-first)

## Component Library

### Shared Components
- **Forms**: Input, Select, DatePicker, FileUpload
- **Tables**: DataTable, SortableTable, FilterableTable
- **Modals**: Modal, ConfirmModal, FormModal
- **Charts**: LineChart, BarChart, PieChart (using Recharts)
- **UI**: Button, Card, Badge, StatusBadge, StatCard

### Layout Components
- **Sidebar**: Role-based navigation
- **Header**: User info, notifications
- **Layout**: Main layout wrapper
- **PageHeader**: Page title and actions

## Routing Strategy

### Route Structure
```
/login                  - Public
/register               - Public
/forgot-password        - Public
/admin/*               - University Admin
/finance/*             - Finance Controller
/registrar/*           - Registrar
/college/*             - College Admin/HOD
/faculty/*             - Faculty/Staff
/student/*             - Student
/applicant/*           - Applicant (pre-enrollment)
```

### Protected Routes
- All routes except `/login`, `/register`, `/forgot-password` are protected
- Role-based access control via `ProtectedRoute` component
- Automatic redirect based on user role

## Error Handling

### Global Error Handler
- Axios interceptor for API errors
- User-friendly error messages
- Error logging for debugging

### Component-Level Error Handling
- Error boundaries for React components
- Try-catch for async operations
- Fallback UI for errors

## Performance Optimization

### Code Splitting
- Lazy loading for routes
- Dynamic imports for heavy components
- Webpack bundle analysis

### Caching Strategy
- React Query for API caching
- LocalStorage for auth tokens
- Service worker for offline support

### Optimization Techniques
- Memoization for expensive computations
- Virtual scrolling for large lists
- Image optimization

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing
- Utility function testing

### Integration Tests
- API integration testing
- User flow testing
- End-to-end testing with Playwright

## Security

### Authentication
- JWT token-based authentication
- Token refresh mechanism
- Secure token storage

### Authorization
- Role-based access control
- Route-level protection
- API-level protection

### Data Security
- Input validation
- XSS prevention
- CSRF protection

## Migration Strategy

### Phase 1: Foundation
- Complete TypeScript types
- Refactor API services
- Build shared components

### Phase 2: Core Modules
- Auth module
- Core module (universities, colleges, departments)
- Academic module

### Phase 3: Domain Modules
- Student module
- Finance module
- Exam module
- HR module
- Library module
- Hostel module
- Transport module
- Admissions module

### Phase 4: Role-Based UI
- University Admin UI
- College Admin UI
- Faculty UI
- Registrar UI
- Finance Controller UI
- Student UI

### Phase 5: Polish
- Performance optimization
- Error handling
- Testing
- Documentation

## Development Guidelines

### Code Style
- ESLint for linting
- Prettier for formatting
- Consistent naming conventions
- TypeScript strict mode

### Git Workflow
- Feature branches
- Pull request reviews
- Semantic versioning

### Documentation
- JSDoc for functions
- README for modules
- Architecture documentation
- API documentation

## Deployment

### Build Process
- Vite for bundling
- Environment-specific configs
- Docker support

### CI/CD
- Automated testing
- Automated deployment
- Rollback strategy

## Monitoring

### Error Tracking
- Sentry for error tracking
- Performance monitoring
- User analytics

### Logging
- Client-side logging
- API logging
- Error logging
