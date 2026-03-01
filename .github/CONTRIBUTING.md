# Contributing to NodeByte Hosting

First, thank you for your interest in contributing! We welcome contributions from everyone in the community.

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). By contributing, you agree to uphold these standards.

## Getting Started

### Prerequisites
- Node.js 18 or higher (or Bun)
- Git
- PostgreSQL 14+
- Familiarity with Next.js, TypeScript, and React

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/website.git
   cd website
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/NodeByteHosting/website.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local database URL and other config
   ```

5. **Set up database**
   ```bash
   npx prisma migrate dev
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Creating a Branch

Use clear, descriptive branch names following this format:
```
feature/short-description
bugfix/short-description
docs/short-description
refactor/short-description
test/short-description
```

Examples:
- `feature/webhook-support`
- `bugfix/settings-save-error`
- `docs/webhook-integration`

### Making Changes

1. **Keep commits focused** - One logical change per commit
2. **Write descriptive commit messages** - See below
3. **Test your changes** - Run tests before pushing
4. **Update documentation** - If you change functionality
5. **Update CHANGELOG** - Add entry to `Unreleased` section

### Commit Message Format

Follow conventional commits:

```
type(scope): short description

Longer explanation if needed. Wrap at 72 characters.

- Bullet points for changes
- Keep it concise

Fixes #123
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or changes
- `chore`: Build, CI, or dependency updates

**Example:**
```
feat(webhooks): add support for custom webhook types

- Add CUSTOM webhook type to enum
- Update dispatcher to handle custom embeds
- Add examples to integration guide

Closes #456
```

## Coding Standards

### TypeScript
- Use strict TypeScript (`strict: true`)
- Export types explicitly
- Avoid `any` type - use `unknown` or generics
- Write JSDoc comments for public APIs

```typescript
/**
 * Sends a webhook notification to Discord
 * @param webhookUrl - Discord webhook URL
 * @param embed - Discord embed object
 * @returns Delivery result with success status
 */
export async function sendWebhook(
  webhookUrl: string,
  embed: DiscordEmbed
): Promise<{ success: boolean; error?: string }> {
  // ...
}
```

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript for prop types
- Add comments for complex logic

```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: "primary" | "secondary"
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}
```

### File Organization
```
packages/core/lib/
  ├── [feature]/ or [feature].ts - Grouped by feature
  ├── utils.ts - Shared utilities
  └── types.ts - Type definitions

app/api/[domain]/
  └── [route]/route.ts - API endpoints by domain
```

### Naming Conventions
- `camelCase` for variables and functions
- `PascalCase` for components and classes
- `UPPER_SNAKE_CASE` for constants
- Prefix private functions with `_` (rarely needed in TypeScript)
- Use descriptive names (avoid `data`, `temp`, `x`)

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  console.error("[Feature] Failed to do something:", error)
  return { success: false, error: String(error) }
}
```

## Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
- Write tests for new features
- Include edge cases
- Keep tests focused on one thing
- Use descriptive test names

```typescript
describe("dispatchWebhook", () => {
  it("should send webhook to Discord", async () => {
    // Arrange
    const webhook = { url: "...", name: "test" }
    
    // Act
    const result = await dispatchWebhook(webhook, embed)
    
    // Assert
    expect(result.success).toBe(true)
  })

  it("should handle connection errors gracefully", async () => {
    // Test error handling
  })
})
```

## Documentation

### Code Comments
```typescript
// GOOD: Explains why, not what
// Webhooks are sent asynchronously to avoid blocking requests
dispatchWebhook(...).catch(console.error)

// BAD: Obvious from code
// Set success to true
const success = true
```

### README Updates
- Keep main README.md up to date
- Document new features with examples
- Include configuration options
- Link to detailed guides

### API Documentation
```typescript
/**
 * Get system settings
 * 
 * @endpoint GET /api/admin/settings
 * @requires admin authentication
 * 
 * @returns {Object} Settings object with:
 *   - pterodactylUrl: string
 *   - registrationEnabled: boolean
 *   - discordWebhooks: array
 * 
 * @example
 * const response = await fetch('/api/admin/settings')
 * const settings = await response.json()
 */
```

## Pull Requests

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Test everything**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

3. **Clean up commits**
   - Squash related commits if needed
   - Reorder for logical flow
   - Remove WIP commits

### PR Description

Use this template:

```markdown
## Description
Brief summary of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2

## Testing
- [ ] Added/updated tests
- [ ] Manually tested locally
- [ ] Tested in production environment

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Review Process

1. At least one maintainer review required
2. All CI checks must pass
3. No conflicts with base branch
4. Approved before merging

**Be responsive to feedback** - We may ask for changes to maintain code quality and consistency.

## Releases

### Version Numbers
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (e.g., 3.2.0)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Process
1. Update version in `package.json`
2. Update `CHANGELOG.md` with all changes
3. Create release commit: `chore: release v3.2.0`
4. Tag commit: `git tag v3.2.0`
5. Push tag to trigger release workflow

## Licensing

By contributing, you agree that your code will be licensed under the GPL-3.0-only license. See [LICENSE](./LICENSE) for details.

## Getting Help

- 💬 **Discord**: https://discord.gg/nodebyte
- 📧 **Email**: hello@nodebyte.host
- 📚 **Docs**: Check `/docs` folder for detailed guides
- 🐛 **Issues**: Search existing issues before creating new ones

## Thank You!

Your contributions help make NodeByte Hosting better for everyone. We appreciate your time and effort!

---

**Questions?** Open an issue or ask in our Discord community!
