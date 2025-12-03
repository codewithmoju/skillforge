# Features Screen Components

This directory contains the components for the EduMate AI Features screen.

## Structure

- **Core Wrappers**:
  - `PinnedSection.tsx`: Handles vertical pinning and scroll-scrubbing animations.
  - `HorizontalScrollSection.tsx`: Translates vertical scroll into horizontal movement.
  - `FeaturesNavigation.tsx`: Sticky table of contents.

- **Feature Sections**:
  - `FeaturesHero.tsx`: The main entry point with layered parallax.
  - `GamifiedLearning.tsx`: XP ring and rewards demo.
  - `RoadmapGenerator.tsx`: Interactive timeline builder.
  - `CourseGenerator.tsx`: Course creation micro-demo.
  - `ChatbotDemo.tsx`: Inline AI chat interaction.
  - `PodcastDemo.tsx`: Audio player card.
  - `SocialHub.tsx`: Horizontal feed of posts.
  - `EncryptedChat.tsx`: Privacy/Encryption demo.
  - `ExploreWorld.tsx`: Global trends map (horizontal scroll).
  - `ProfilePreview.tsx`: Gamified profile card.
  - `ThemeSwitcher.tsx`: Theme customization demo.

## Configuration

### Animations
Animations are powered by **GSAP** and **ScrollTrigger**.
- To adjust scroll speeds, look for `scrub` values in `ScrollTrigger` configs.
- To adjust pinning duration, modify the `end` property (e.g., `+=150%`).

### Accessibility
- All scroll-driven animations check for `prefers-reduced-motion`.
- If reduced motion is enabled, animations are disabled or simplified to simple fades.

### Assets
- Replace placeholder SVGs/Icons with real assets in the respective component files.
- Lottie animations can be added using `lottie-react` (not currently installed, using CSS/SVG placeholders).

## Usage

The main page assembly is located at `app/features/page.tsx`. It wraps all sections in a `SmoothScroll` context (Lenis).
