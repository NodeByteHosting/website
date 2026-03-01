# @nodebyte/core

Core utilities and API client for NodeByte frontend.

## API Client

### Quick Start

```tsx
import { useApiQuery, useApiMutation } from "@/packages/core"

// GET request (authenticated via /api/go proxy)
function MyComponent() {
  const { data, isLoading, error } = useApiQuery("/api/admin/users")
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{JSON.stringify(data)}</div>
}

// POST/PUT/PATCH/DELETE request (authenticated)
function MyMutationComponent() {
  const createUser = useApiMutation("POST", "/api/admin/users")
  
  return (
    <button onClick={() => createUser.mutate({ name: "John" })}>
      Create User
    </button>
  )
}
```

### Direct API (Unauthenticated)

For unauthenticated operations like registration and password reset, use `directApi`:

```tsx
import { directApi } from "@/packages/core"

// Server-side only (e.g., in API routes)
const result = await directApi.post("/api/v1/auth/register", {
  email: "user@example.com",
  password: "secure123"
})
```

### Features

- ✅ **Type-safe** - Full TypeScript support
- ✅ **Dual mode** - `api` for authenticated (via proxy), `directApi` for unauthenticated
- ✅ **Auth handled** - `/api/go` proxy automatically injects JWT from NextAuth
- ✅ **TanStack Query** - Built on React Query for caching, refetching, etc.
- ✅ **Error handling** - Proper error types and messages
- ✅ **Automatic invalidation** - Smart cache invalidation patterns

### Architecture

```
Client Component (authenticated)
    ↓
useApiQuery/useApiMutation
    ↓
api.get/post/put/delete
    ↓
/api/go/[...path] (Next.js API route - injects JWT)
    ↓
Go Backend (http://localhost:8080)


Server Route (unauthenticated)
    ↓
directApi.post/get/put/delete
    ↓
Go Backend (http://localhost:8080)
```

### Advanced Usage

#### Query with params
```tsx
const { data } = useApiQuery("/api/admin/sync/logs", { limit: 10 })
```

#### Mutation with dynamic path
```tsx
const deleteItem = useApiMutation(
  "DELETE",
  (id: string) => `/api/admin/items/${id}`
)

deleteItem.mutate("item-123")
```

#### Manual cache invalidation
```tsx
import { useInvalidateQueries } from "@/packages/core/hooks/use-api"

const invalidate = useInvalidateQueries()

// Invalidate all queries starting with "/api/admin/sync"
invalidate("/api/admin/sync")
```

#### Direct API calls (outside React)
```tsx
import { api } from "@/packages/core/lib/api"

const data = await api.get("/api/admin/users")
await api.post("/api/admin/users", { name: "John" })
await api.put("/api/admin/users/123", { name: "Jane" })
await api.delete("/api/admin/users/123")
```

## Migration Guide

### From old `use-admin-api.ts`

**Before:**
```tsx
import { useAdminQuery } from "@/packages/core/hooks/use-admin-api"

const { data } = useAdminQuery("/api/admin/sync")
```

**After:**
```tsx
import { useApiQuery } from "@/packages/core/hooks/use-api"

const { data } = useApiQuery("/api/admin/sync")
```

The old hooks in `use-admin-api.ts` are now **thin wrappers** around the new API client, so they still work but you should migrate to the new hooks for more flexibility.

### From raw fetch

**Before:**
```tsx
const response = await fetch("/api/go/api/admin/sync", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
const result = await response.json()
```

**After:**
```tsx
import { api } from "@/packages/core/lib/api"

const result = await api.post("/api/admin/sync", data)
```

## Error Handling

The API client throws `ApiError` instances:

```tsx
import { ApiError } from "@/packages/core/lib/api"

try {
  await api.post("/api/admin/sync")
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.message)  // User-friendly message
    console.log(error.status)   // HTTP status code
    console.log(error.response) // Raw response body
  }
}
```

With React Query hooks:

```tsx
const { error } = useApiQuery("/api/admin/sync")

if (error) {
  // error is typed as ApiError
  console.log(error.message)
  console.log(error.status)
}
```
