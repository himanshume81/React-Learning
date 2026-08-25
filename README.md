# React Next.js Learning

A Next.js learning project built with the App Router, React 19, TypeScript, and Tailwind CSS. It demonstrates **atomic design**, form handling with validation, and async data loading with loading and empty states.

## Tech stack

| Tool | Purpose |
|------|---------|
| [Next.js 16](https://nextjs.org) | App Router, layouts, pages |
| [React 19](https://react.dev) | UI components |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling |
| [React Hook Form](https://react-hook-form.com) | Form state |
| [Zod](https://zod.dev) | Schema validation |

## Getting started

### Prerequisites

- Node.js 18+ (Node 22+ recommended for latest pnpm)
- pnpm (or npm / yarn)

### Install and run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
pnpm build   # Production build
pnpm start   # Start production server
pnpm lint    # Run ESLint
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard with feature cards |
| `/products` | Product list with loading and empty states |
| `/login` | Sign-in form with validation |

## Project structure

```
app/
├── globals.css          # Tailwind + CSS variables
├── layout.tsx           # Root layout (fonts, metadata)
├── page.tsx             # Home / dashboard
├── login/page.tsx       # Login page
└── products/page.tsx    # Products page

components/
├── atoms/               # Button, Input, Label, Text, Spinner, etc.
├── molecules/           # Card, FormField, NavLink, ProductItem, etc.
├── organisms/           # Header, Sidebar, LoginForm, ProductList, etc.
└── templates/           # AppLayout

lib/
├── mock-products.ts     # Mock product data + fetch helpers
└── validation/
    └── login-schema.ts  # Zod login validation

types/
└── product.ts           # Product type definition
```

## Architecture

### Atomic design

Components are organized by responsibility:

- **Atoms** — smallest UI pieces (`Button`, `Input`, `Text`, `Spinner`)
- **Molecules** — combinations of atoms (`FormField`, `Card`, `ProductItem`)
- **Organisms** — larger sections (`Header`, `Sidebar`, `LoginForm`, `ProductList`)
- **Templates** — page shells (`AppLayout`)
- **Pages** — route entry points in `app/`

### App layout

`AppLayout` wraps main app pages with:

- **Header** — logo, navigation links, sign-in link
- **Sidebar** — dashboard menu (hidden on small screens, visible from `md` up)
- **Main** — page content area

The login page uses its own centered layout without `AppLayout`.

## Features

### Dashboard (`/`)

- Responsive card grid (`md:grid-cols-2`, `lg:grid-cols-3`)
- Reusable `Card` molecule with title, description, and footer actions
- `Button` variants: `primary`, `secondary`, `ghost`

### Products (`/products`)

Client-side product list powered by `ProductListContainer`:

- Fetches mock data via `fetchProducts()` with a simulated delay
- **Loading state** — spinner + skeleton placeholders
- **Empty state** — message with optional action button
- **Load / empty toggle** — buttons to reload products or show an empty list
- Each product shows name, description, category, and formatted price

Mock data lives in `lib/mock-products.ts` (5 sample products).

### Login (`/login`)

Form built with **React Hook Form** and validated with **Zod**:

- Email — required, valid email format
- Password — required, minimum 8 characters
- Inline field errors via `FormField`
- Simulated API call (800ms delay) on successful submit
- Success message after login

Validation schema: `lib/validation/login-schema.ts`

## Styling

- **Tailwind CSS 4** with `@import "tailwindcss"` in `globals.css`
- CSS variables for `--background` and `--foreground`
- Dark mode follows system preference via `@media (prefers-color-scheme: dark)`
- Responsive utilities used across layout (`sm:`, `md:`, `lg:`)

## Data types

```ts
// types/product.ts
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
};
```

## Key patterns

### Client components

Files that use hooks or browser APIs are marked `"use client"`:

- `LoginForm`
- `ProductListContainer`
- `Button`

### Mock async fetching

```ts
// lib/mock-products.ts
export async function fetchProducts(ms = 1200): Promise<Product[]>
export async function fetchEmptyProducts(ms = 1200): Promise<Product[]>
```

Both helpers delay before returning data to practice loading UI.

### Form validation flow

1. User submits the login form
2. React Hook Form collects values
3. Zod schema validates via `loginSchema.safeParse()`
4. Errors are mapped back to form fields with `setError()`
5. On success, a mock API call runs and a success message is shown

## License

Private learning project.
