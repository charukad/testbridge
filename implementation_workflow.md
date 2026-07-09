# Implementation Workflow

This file tracks the active implementation constraints and workflows required for TestBridge.

## General Development Process
1. **Monolithic Architecture**: Since we are using Next.js App Router, the application acts as a monolith, with server components and actions providing backend functionality.
2. **Domain-Driven Design (Adapted)**: Business logic, Mongoose models, and services will reside inside `src/domain/`. Server actions for data mutation will live in `src/actions/`.
3. **Database Integration**: Connect to MongoDB via Mongoose before executing models. Avoid exposing database connection strings on the client side.
4. **Environment Variables**: Store all API keys (Cloudinary, MongoDB, NextAuth secret) in a `.env.local` file and validate them.
5. **UI & Styling**: strictly use Tailwind CSS and shadcn/ui for consistent, premium aesthetics.
6. **Authentication**: Use NextAuth.js to protect pages based on roles (Developer vs. Tester).

## GitHub & Commit Rules
- Commit often following the chunked plan.
- Use Conventional Commits (`feat`, `fix`, `chore`, `docs`).
- Make sure everything compiles and lints before pushing.
