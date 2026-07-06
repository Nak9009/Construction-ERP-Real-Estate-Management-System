# UI_GUIDELINES.md

## Purpose
This document defines the enterprise design system and frontend architecture for the Construction ERP & Real Estate Management System. It ensures consistency, accessibility, and high visual quality across the entire Next.js application.

## Scope
Applies to all React components, views, layouts, and styles within the Next.js frontend application.

## Design Principles
1. **100% shadcn/ui**: All UI components must be derived from `shadcn/ui`. Do not invent custom UI components if an equivalent pattern exists in shadcn/ui.
2. **Accessible by Default**: All interfaces must be fully accessible (a11y), supporting keyboard navigation and screen readers.
3. **Responsive**: The system must function beautifully on ultra-wide desktop monitors, standard laptops, and mobile viewports.
4. **Dark Mode First**: The application must natively support seamless switching between Light and Dark mode using Tailwind CSS `dark:` variants.

## The Enterprise Design System

### 1. Typography
- **Primary Font**: Inter (or system sans-serif fallback).
- **Scale**: Use Tailwind's default typography scale (`text-xs` to `text-4xl`).
- **Hierarchy**: Ensure clear contrast between headings (e.g., `text-primary font-bold`) and body text (e.g., `text-muted-foreground`).

### 2. Colors & Theming
We use CSS variables mapped to Tailwind configuration (via `shadcn/ui` convention).
- **Background**: `bg-background`
- **Surface/Cards**: `bg-card`
- **Text**: `text-foreground`, `text-muted-foreground`
- **Primary Action**: `bg-primary text-primary-foreground`
- **Destructive/Error**: `bg-destructive`
- **Success/Warning**: Utilize standard Tailwind colors (e.g., `emerald-500` for success, `amber-500` for warnings) primarily in Status Badges.

### 3. Spacing, Grid, and Breakpoints
- **Spacing**: Use standard Tailwind spacing (e.g., `p-4`, `m-2`, `gap-6`).
- **Grid Layout**: 
  - Dashboards: Use CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
  - Forms: Use CSS Grid or Flexbox for 2-column or 3-column layouts on desktop.
- **Breakpoints**: 
  - Mobile: `< 768px` (default)
  - Tablet: `md:` (`>= 768px`)
  - Desktop: `lg:` (`>= 1024px`)
  - Ultra-wide: `xl:` (`>= 1280px`)

### 4. Icons
- Use **Lucide React** (`lucide-react`) exclusively for all icons.

## Component Specifications (shadcn/ui Usage)

### Layout & Navigation
- **Dashboard Layout**: Standard configuration involves a persistent `Sidebar` on the left and a sticky `TopNav` at the top.
- **Navigation**: Use `Navigation Menu` for complex top-tier navigation, and standard links styled as `Button variant="ghost"` for the Sidebar.

### Data Display
- **Tables**: Use `Data Table` (TanStack Table + shadcn) for all grid-based data. Must include sorting, filtering, and pagination for large datasets.
- **Status Tags**: Always use the `Badge` component. E.g., `<Badge variant="outline" className="bg-emerald-500/20 text-emerald-400">Active</Badge>`.
- **User Profiles**: Use `Avatar` with a fallback image.

### Forms & Input
- **Forms**: Use `react-hook-form` coupled with `zod` validation and the shadcn `Form` wrappers.
- **Inputs**: Use standard `Input`, `Textarea`, `Select`, `Combobox` (for searchable dropdowns), and `Checkbox`.
- **Modals**: Use `Dialog` for creation/editing forms to prevent navigating away from context. Use `Sheet` for complex multi-step settings panels.

### Feedback & States
- **Loading**: Use `Skeleton` for all initial data fetching to avoid layout shift. Do not use generic spinners for full-page loads.
- **Empty States**: Display a visually appealing empty state (Icon, Title, Description, and a Primary Action Button) when a table or list has no data.
- **Errors**: Use `Alert` for inline errors and `Toast` (via `useToast`) for transient action results.
- **Confirmation**: Use `Dialog` for destructive action confirmations.

## Best Practices
- **Server Components**: Default to React Server Components (RSC) for layout and data fetching.
- **Client Components**: Add `"use client"` only at the leaves of the component tree for interactivity (e.g., Forms, Dialogs).
- **Z-Index Management**: Be extremely careful with `z-index`. Rely on Radix UI's built-in portal mechanisms for modals and popovers.

## Anti-Patterns
- **Custom CSS**: Avoid writing custom CSS in `.css` files. Use Tailwind utility classes.
- **Inline Styles**: Never use `style={{ ... }}` unless calculating dynamic values (like a chart width percentage).
- **Mixing UI Libraries**: Do not install MUI, AntDesign, or ChakraUI. Maintain strict adherence to `shadcn/ui` and Radix.

## Future Expansion
- **Micro-Frontends**: Design page structures to be fully decoupled to support future micro-frontend architecture if needed.
- **Motion**: Integrate `framer-motion` for subtle page transitions and micro-interactions, but keep it minimal and tasteful to maintain an enterprise feel.
