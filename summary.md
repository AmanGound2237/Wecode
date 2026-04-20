# Wecode — Project Summary

**Wecode** is an AI-focused technical practice platform designed for mastering Machine Learning, Deep Learning, and Data Science through hands-on coding. It provides a structured environment similar to LeetCode, tailored for data-centric and algorithmic AI tasks, with a new AI-driven research paper learning pipeline.

## 🎨 Design Direction: "Future Hacker" / Matrix Theme

The platform uses a **Matrix / Git Commit** visual identity — dark, futuristic, and highly technical.

- **Color Palette:** Deep blacks (`bg-black`, `gray-950`) as the foundation, heavily accented with terminal greens (`green-500`, `green-400`). Danger states use red-500.
- **Typography:** JetBrains Mono (monospace) as the primary font for all interactive elements, headers, and code. Space Grotesk as a secondary display font.
- **Styling:** Green glow effects (text-shadow, box-shadow), sharp edges (2px border-radius), thin green borders, dark glass card surfaces.
- **Animations:** CRT scanline overlay, blinking terminal cursors, typing reveal effects, glow pulse on hover, matrix data-stream background.
- **Design Tokens:** All colors and utilities are defined in `globals.css` using Tailwind CSS 4's `@theme inline` system. Key classes: `.glow-text`, `.glow-border`, `.glow-box`, `.card-surface`, `.btn-primary`, `.btn-outline`, `.typing-cursor`, `.scanline-overlay`, `.terminal-label`.

## 🚀 Key Features

### 1. **AI-Focused Problem Set**
- Curated challenges across various domains: **Supervised Learning**, **Unsupervised Learning**, **Deep Learning**, **NLP**, and **Computer Vision**.
- Difficulty levels ranging from **EASY** (basic concepts like Sigmoid) to **HARD** (complex implementations like Optimizers).
- Integrated video tutorials and theoretical context for each topic.

### 2. **Practice & Submissions**
- **Code Execution**: Supports Python-based solutions with logic for measuring runtime and memory usage.
- **Submission Tracking**: Historical log of attempts with statuses (Accepted, Wrong Answer, Runtime Error, etc.).
- **Starter Templates**: Provides boilerplate code for each problem to help users get started quickly.

### 3. **Curriculum-Based Learning**
- Problems are grouped into **Topics** (e.g., "What is ML", "Feature Scaling", "CNN").
- Each topic includes a "Theory" section and recommended external resources (YouTube) for synchronized learning.

### 4. **Code with AI — Research Paper Learning Pipeline** *(New)*
An AI-driven feature where users upload research papers and learn/implement them interactively using the Gemini API.

**The Learning Pipeline:**
1. **Paper Upload**: User uploads a research paper (text/markdown). System extracts and stores content.
2. **Prerequisites Engine**: Gemini analyzes the paper and outputs required foundational knowledge with suggested resources/links *before* the user attempts implementation.
3. **Progressive Breakdown**: The AI splits the paper into a series of smaller, code-focused tasks (5–15 steps), each with starter code, hints, and test cases.
4. **Real-World Synthesis**: A final summary stage explaining the "Why" and "How this is used in the industry today" with specific companies and use cases.

**Data Models:** `ResearchPaper`, `Prerequisite`, `ImplementationStep`, `Synthesis` (see `prisma/schema.prisma`).
**Service Layer:** `src/lib/gemini.ts` (GeminiService class — structured but not yet connected to API).
**Types:** `src/lib/paper-types.ts` (PaperAnalysis, PrerequisiteData, StepData, SynthesisData, PaperPipeline).

### 5. **User Management & Auth**
- Custom Authentication using **Iron Session** and **bcryptjs**.
- Password reset functionality integrated with **Nodemailer**.
- Admin controls for managing problem content and user data.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (CSS-based `@theme inline` config)
- **AI**: Google Gemini API (via `src/lib/gemini.ts`)
- **Execution**: Scalable runner logic (Docker-ready)
- **Infrastructure**: Configured for deployment on Render/Docker.

## 📁 Project Structure

- `src/app`: Next.js pages and API routes.
- `src/app/globals.css`: Matrix theme design system (all tokens, utilities, animations).
- `src/components`: Reusable UI components (SiteHeader, ProblemCard, CodeEditor, etc.).
- `src/lib`: Core utilities (database client, auth, runners, Gemini service, type definitions).
- `prisma/`: Database schema (including Code with AI models) and seeding scripts.
- `public/`: Static assets and icons.

## 🗺️ Roadmap

- [x] Phase 1: Theme foundation (globals.css, Prisma schema, service layer, types)
- [ ] Phase 2: Component overhaul (rewrite all UI to Matrix theme)
- [ ] Phase 3: "Code with AI" pages and API routes
- [ ] Phase 4: Animations & polish (Framer Motion, matrix rain, page transitions)

---
*Maintained by Antigravity AI.*
