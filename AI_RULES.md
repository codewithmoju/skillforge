# AI Development Rules for SkillForge

This document outlines the core technologies and best practices for developing features within the SkillForge application.

## Tech Stack Overview

*   **Framework:** Next.js 16 (App Router) for server-rendered React applications.
*   **Language:** TypeScript for type safety and improved developer experience.
*   **Styling:** Tailwind CSS 4 for utility-first styling, ensuring responsive and consistent designs.
*   **UI Components:** shadcn/ui for pre-built, accessible, and customizable UI components.
*   **State Management:** Zustand for simple and efficient global state management.
*   **Animations:** Framer Motion for declarative and fluid UI animations.
*   **AI Integration:** Google Gemini 1.5 Flash for generating roadmaps and quizzes.
*   **Authentication & Database:** Firebase (Authentication and Firestore) for user management and data persistence.
*   **Icons:** Lucide React for a comprehensive set of customizable SVG icons.
*   **Utilities:** `clsx` and `tailwind-merge` for combining Tailwind classes conditionally.

## Library Usage Rules

To maintain consistency and efficiency, please adhere to the following guidelines when using libraries:

*   **Styling:**
    *   **Always** use Tailwind CSS for all styling. Avoid inline styles or separate CSS files unless absolutely necessary for global overrides (e.g., `globals.css`).
    *   For common UI elements, leverage existing `shadcn/ui` components. If a `shadcn/ui` component needs significant modification, create a new component that wraps or extends it, rather than editing the original `shadcn/ui` file.
*   **State Management:**
    *   Use **Zustand** (`lib/store.ts`) for all global application state.
    *   For local component state, use React's `useState` and `useReducer` hooks.
*   **Animations:**
    *   All complex UI animations should be implemented using **Framer Motion**.
*   **AI Integration:**
    *   Interact with AI models exclusively through the provided **Google Generative AI** client (`@google/generative-ai`) via API routes (`app/api/`).
*   **Authentication & Database:**
    *   **Firebase** is the sole provider for authentication (`firebase/auth`) and database operations (`firebase/firestore`). All interactions should go through the `lib/firebase.ts` configuration and the `lib/services/firestore.ts`, `lib/services/posts.ts`, `lib/services/follow.ts`, `lib/services/comments.ts`, `lib/services/leaderboard.ts`, `lib/services/username.ts` service files.
*   **Icons:**
    *   Use icons from the **Lucide React** library.
*   **Routing:**
    *   Utilize **Next.js App Router** for all navigation and page-based routing.
*   **Utility Functions:**
    *   For conditional class merging, use the `cn` utility function from `lib/utils.ts`.
    *   For image handling (conversion, validation, compression), use the utilities in `lib/utils/imageUpload.ts`.
    *   For sharing functionality, use the utilities in `lib/utils/share.ts`.
*   **Modals:**
    *   Use the custom `Modal` component from `components/ui/Modal.tsx` for all modal dialogs.