# How I Structured My Large Next.js Project

When a Next.js project is small, everything feels easy.

You have a few pages, a few components, and maybe one API route.

But as the project grows, things can get messy fast.

Suddenly you have:

- too many components
- too many hooks
- random utility files
- repeated logic
- confusing folders
- hard-to-find code

That is when project structure becomes extremely important.

A good folder structure does not just make your code look clean.

It makes your project easier to:

- scale
- debug
- onboard developers
- maintain
- refactor
- ship faster

Here is how I like to structure a large Next.js project.

# **The Goal of a Good Project Structure**

A good structure should help you answer one question quickly:

*“Where should this code live?”*

If you constantly wonder where to put files, your structure is not clear enough.

For large projects, I usually follow this idea:

*Keep route-level code in `app`, shared code in `components`, business logic in `lib`, and feature-specific logic inside feature folders.*

Simple.

# **My Basic Folder Structure**

Here is a clean structure for a large Next.js project:

```
src/
  app/
  components/
  features/
  hooks/
  lib/
  types/
  constants/
  styles/
  middleware.ts
```

Let’s break each folder down.

# **1. The `app` Folder**

The `app` folder is where all routes live.

Example:

```
app/
  dashboard/
    page.tsx
  settings/
    page.tsx
  auth/
    login/
      page.tsx
  api/
    users/
      route.ts
```

I keep this folder focused only on routing.

That means I avoid putting too much business logic directly inside page files.

Bad:

```
export default function DashboardPage() {
  // 300 lines of fetching, filtering, UI, state, and logic
}
```

Better:

```
export default function DashboardPage() {
  return <DashboardView />;
}
```

The page should mostly connect the route to the actual feature.

# **2. The `components` Folder**

The `components` folder is for reusable UI components.

Example:

```
components/
  ui/
    Button.tsx
    Input.tsx
    Modal.tsx
  layout/
    Navbar.tsx
    Sidebar.tsx
    Footer.tsx
  shared/
    EmptyState.tsx
    LoadingSpinner.tsx
```

I usually divide it into:

- `ui` for small reusable design components
- `layout` for navbar, sidebar, footer
- `shared` for common app-level components

These components should be reusable across multiple features.

# **3. The `features` Folder**

This is the most important folder in large projects.

Instead of dumping everything into global folders, I group code by feature.

Example:

```
features/
  auth/
    components/
    hooks/
    actions/
    types.ts
  dashboard/
    components/
    hooks/
    services/
    types.ts
  billing/
    components/
    hooks/
    services/
    types.ts
  settings/
    components/
    hooks/
    services/
    types.ts
```

This keeps related code close together.

For example, all billing-related logic stays inside `features/billing`.

That makes the project easier to understand.

# **Why Feature-Based Structure Works Better**

In small projects, type-based folders are fine.

Example:

```
components/
hooks/
utils/
services/
```

But in large projects, these folders become huge.

You end up with:

- 100 components
- 40 hooks
- 30 utility files

And nobody knows what belongs where.

Feature-based structure solves this.

Instead of asking:

> *“Is this a hook or service?”*
> 

You ask:

> *“Which feature does this belong to?”*
> 

Much easier.

# **4. The `lib` Folder**

The `lib` folder is for shared logic and external service setup.

Example:

```
lib/
  firebase.ts
  openai.ts
  prisma.ts
  stripe.ts
  auth.ts
  utils.ts
```

This folder should contain reusable core logic.

Examples:

- database client
- OpenAI client
- payment setup
- auth helpers
- formatting helpers

Important rule:

> *Do not put feature-specific logic in `lib`.*
> 

For example, billing-specific API logic should live in `features/billing`, not `lib`.

# **5. The `hooks` Folder**

The global `hooks` folder is only for hooks used across the entire app.

Example:

```
hooks/
  useDebounce.ts
  useMediaQuery.ts
  useLocalStorage.ts
```

If a hook belongs only to one feature, keep it inside that feature.

Example:

```
features/billing/hooks/useSubscription.ts
```

This keeps global hooks clean.

# **6. The `types` Folder**

The `types` folder is for global TypeScript types.

Example:

```
types/
  user.ts
  api.ts
  common.ts
```

But feature-specific types should stay inside their feature.

Example:

```
features/dashboard/types.ts
```

This avoids one giant `types.ts` file with everything inside it.

# **7. The `constants` Folder**

The `constants` folder stores values that do not change often.

Example:

```
constants/
  routes.ts
  plans.ts
  roles.ts
  navigation.ts
```

Example:

```
export const ROUTES = {
  dashboard: "/dashboard",
  settings: "/settings",
  login: "/auth/login",
};
```

This prevents hardcoding routes and values everywhere.

# **8. The `styles` Folder**

Global styles stay here.

Example:

```
styles/
  globals.css
```

If you use Tailwind CSS, most styling will be inside components.

But global styles, custom classes, and theme-level CSS can stay in `styles`.

# **Example Large Next.js Structure**

Here is a more complete example:

```
src/
  app/
    dashboard/
      page.tsx
    billing/
      page.tsx
    settings/
      page.tsx
    api/
      chat/
        route.ts
```

```
  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
    layout/
      Sidebar.tsx
      Navbar.tsx  features/
    dashboard/
      components/
        DashboardStats.tsx
        RecentActivity.tsx
      hooks/
        useDashboardData.ts
      services/
        dashboardService.ts
      types.ts    billing/
      components/
        PricingCard.tsx
        BillingHistory.tsx
      services/
        billingService.ts
      types.ts    ai-chat/
      components/
        ChatBox.tsx
        MessageBubble.tsx
      hooks/
        useChat.ts
      services/
        chatService.ts
      types.ts  hooks/
    useDebounce.ts  lib/
    openai.ts
    firebase.ts
    utils.ts  constants/
    routes.ts
    roles.ts  types/
    common.ts
```

This structure scales much better.

# **How I Structure Components**

For components, I follow a simple rule:

> *If it is reused everywhere, put it in `components`. If it belongs to one feature, put it inside that feature.*
> 

Example:

Reusable button:

```
components/ui/Button.tsx
```

Dashboard-only card:

```
features/dashboard/components/DashboardStats.tsx
```

This avoids cluttering the global components folder.

# **How I Structure API Routes**

In the App Router, API routes live inside:

```
app/api/
```

Example:

```
app/api/chat/route.ts
app/api/upload/route.ts
app/api/billing/route.ts
```

For small logic, route files are fine.

But for larger logic, I move the heavy work into services.

Example:

```
import { generateChatResponse } from "@/features/ai-chat/services/chatService";
```

```
export async function POST(req: Request) {
  const body = await req.json();
  const result = await generateChatResponse(body.message);  return Response.json(result);
}
```

This keeps route files clean.

# **How I Handle Server and Client Components**

In Next.js, I keep server components as the default.

I only use `"use client"` when needed.

Use client components for:

- forms
- modals
- dropdowns
- interactive dashboards
- local state
- browser APIs

Use server components for:

- data fetching
- static pages
- protected server logic
- SEO pages

This improves performance.

# **Naming Conventions I Follow**

Good naming matters a lot in large projects.

I usually use:

```
Button.tsx
UserCard.tsx
DashboardStats.tsx
useDashboardData.ts
billingService.ts
authActions.ts
```

Simple rule:

> *File names should explain what the file does.*
> 

Avoid vague names like:

```
helper.ts
data.ts
misc.ts
newFile.tsx
```

These become confusing quickly.

# **Common Mistakes to Avoid**

# **1. Putting Everything in Components**

Not every file is a component.

Business logic should not live inside UI components.

# **2. Creating One Giant Utils File**

A `utils.ts` file with 100 functions becomes hard to manage.

Split utilities by purpose.

Example:

```
dateUtils.ts
formatUtils.ts
fileUtils.ts
```

# **3. Not Separating Feature Logic**

If billing, dashboard, and auth logic are mixed everywhere, debugging becomes painful.

Keep feature logic isolated.

# **4. Overengineering Too Early**

Do not create 50 folders for a small project.

Start simple.

Add structure as your app grows.

A large Next.js project becomes easier to manage when your structure is predictable.

My simple rule is:

- `app` for routes
- `components` for shared UI
- `features` for business modules
- `lib` for shared setup
- `hooks` for global hooks
- `types` for global types
- `constants` for fixed values

The goal is not to create the perfect folder structure.

The goal is to make your project easy to understand six months later.

Because clean structure is not just about organization.

It is about moving faster without breaking everything.