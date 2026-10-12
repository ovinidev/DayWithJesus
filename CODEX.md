# CLAUDE.md

## Project Overview

This is a Vue 3 project using the Composition API with `<script setup>` syntax.
Must use English language to all

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Language:** TypeScript
- **UI Library:** PrimeVue
- **Data Fetching:** TanStack Query (Vue Query)
- **HTTP Client:** Axios
- **Testing:** Vitest + Vue Test Utils
- **Formatting:** Prettier (with Tailwind CSS plugin)

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
├── composables/     # Composable functions (useGetUser, useFetch, etc.)
├── constants/       # App-wide constants and enums
├── services/        # API service modules (Axios calls)
├── styles/          # Global styles, theme overrides, CSS variables
├── App.vue          # Root component
└── main.ts          # App entry point
```

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm preview` — Preview production build locally
- `pnpm format` — Run Prettier
- `pnpm test` — Run tests with Vitest
- `pnpm test:watch` — Run tests in watch mode

## Prettier Config

- No semicolons
- Single quotes
- No trailing commas
- 2-space indentation
- `vueIndentScriptAndStyle: true` — indent inside `<script>` and `<style>` blocks
- Vue files use the `vue` parser
- Tailwind CSS class sorting via `prettier-plugin-tailwindcss`

## Code Conventions

### Components

- Always use `<script setup lang="ts">`.
- **`<script>` block always comes first**, then `<template>`. No `<style>` at the top.
- Indent content inside `<script>` and `<style>` blocks (enforced by Prettier).
- Use PascalCase for component file names: `UserProfile.vue`, `AppHeader.vue`.
- One component per file. Keep components focused and small.
- Define props with `defineProps()` using the runtime declaration style.
- Destructure props directly from `defineProps()`.

```vue
<script setup lang="ts">
  const { name, link } = defineProps({
    name: String,
    link: String
  })
</script>

<template>
  <a
    class="underline"
    target="_blank"
    rel="noreferrer"
    :href="link"
    :text="name"
  />
</template>
```

### Composables

- Name files and functions with `use` prefix: `useGetUser.ts`, `useAuth.ts`.
- **Always export as `const` arrow function**, not function declaration.
- Return reactive state and methods as a plain object.

```ts
export const useGetUser = () => {
  // composable logic here
}
```

- For TanStack Query composables, wrap queries inside the composable:

```ts
import { useQuery } from '@tanstack/vue-query'
import { getUser } from '@/services/userService'

export const useGetUser = (userId: Ref<string>) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId.value)
  })
}
```

### Data Fetching (TanStack Query)

- Use TanStack Query for all server state (fetching, caching, syncing).
- Wrap every query/mutation in a dedicated composable inside `src/composables/`.
- Use descriptive query keys: `['users']`, `['user', userId]`, `['products', filters]`.
- Use `useQuery` for reads and `useMutation` for writes.
- Do NOT store server data in local reactive state — let TanStack Query manage it.
- Configure default options (staleTime, retry, etc.) in the QueryClient setup in `main.ts`.

### API / Services (Axios)

- Centralize API calls in `src/services/` modules.
- Each service file maps to a resource: `userService.ts`, `productService.ts`.
- Create a shared Axios instance in `src/services/api.ts` with base URL and interceptors.
- Service functions should be plain async functions that return typed data.
- Do NOT handle loading/error states in services — TanStack Query handles that.

```ts
// services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
```

```ts
// services/userService.ts
import { api } from '@/services/api'
import type { User } from '@/types'

export const getUser = async (id: string): Promise<User> => {
  const { data } = await api.get(`/users/${id}`)
  return data
}
```

### PrimeVue

- Use PrimeVue components as the primary UI building blocks.
- Import components individually (tree-shakeable) rather than globally when possible.
- Place PrimeVue theme overrides and design token customization in `src/styles/`.
- Use PrimeVue's built-in props for variants, sizes, and severity — avoid re-implementing them.

### Constants

- Store app-wide constants in `src/constants/`.
- Use `as const` for literal type safety.
- Group related constants by domain: `routes.ts`, `queryKeys.ts`, `validation.ts`.

```ts
// constants/queryKeys.ts
export const QUERY_KEYS = {
  users: ['users'],
  user: (id: string) => ['user', id]
} as const
```

### TypeScript

- Prefer `interface` over `type` for object shapes.
- Avoid `any` — use `unknown` and narrow with type guards.
- Use strict mode (`"strict": true` in tsconfig).

### Styling

- Use scoped styles by default: `<style scoped>`.
- Use Tailwind CSS utility classes (sorted by Prettier plugin).
- Place global styles and PrimeVue theme overrides in `src/styles/`.
- Use CSS variables for theming and design tokens.

## General Rules

- Do NOT use the Options API. Always use Composition API with `<script setup>`.
- Do NOT use `this` — it doesn't exist in `<script setup>`.
- Prefer `ref()` for primitives and `reactive()` for objects, but stay consistent.
- Keep template logic minimal — move complex expressions into `computed` or composables.
- Always handle loading, error, and empty states in UI components using TanStack Query's `isLoading`, `isError`, and `data` refs.
- Service functions are plain async calls. Composables wrap them with TanStack Query. Components consume composables. Never call services directly from components.
- Follow the formatting rules enforced by Prettier — no semicolons, single quotes, no trailing commas, indented script/style blocks.

### Testing (Vitest)

- Place test files next to source: `UserProfile.vue` → `UserProfile.test.ts`.
- Use `describe` / `it` blocks. Name tests as behavior: `it('shows error when form is invalid')`.
- Mount components with `mount()` or `shallowMount()` from Vue Test Utils.
- Mock API calls and TanStack Query in tests.
- For composables, use `@vue/test-utils` `renderHook` or wrap in a test component.

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfile from './UserProfile.vue'

describe('UserProfile', () => {
  it('renders the user name', () => {
    const wrapper = mount(UserProfile, {
      props: { name: 'John' }
    })
    expect(wrapper.text()).toContain('John')
  })
})
```

### Api

- Centralize API calls in `src/services/` modules.
- Use tanstack/query for data fetching and caching.
