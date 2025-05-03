# Contributing to AgeGate

Thanks for considering contributing to AgeGate! This document provides some guidelines to help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`

## Building and Testing

- Build the library with `pnpm build`
- Check types with `pnpm check`
- Format code with `pnpm format`
- Check formatting with `pnpm lint`

## Release Process

AgeGate uses GitHub Actions to automatically publish to npm when a new version tag is pushed:

1. Update the version in `package.json`
2. Commit the changes: `git commit -am "Bump version to x.y.z"`
3. Create a new version tag: `git tag vx.y.z`
4. Push the changes and tags: `git push && git push --tags`

The GitHub workflow will automatically build and publish the package to npm under the `@valink-solutions-ltd` organization.

## Coding Standards

- Follow the existing code style (Prettier with TailwindCSS plugin)
- Use Svelte 5 with `$state` and `$props()` syntax
- Use component-scoped styles with `agegate-` prefix
- Add appropriate TypeScript type annotations
- Ensure accessibility (light/dark mode, keyboard navigation)
- Always check for `browser` existence before using browser APIs

## Pull Requests

- Create a branch for your changes
- Make your changes and commit them
- Submit a pull request with a clear description of the changes
- Ensure all checks pass
