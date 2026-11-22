# Frontend Documentation

## 1. Project Overview

This frontend is the user-facing web application for the AgroAI platform, an AI-powered agricultural decision support system. It provides farmers and administrators with an interactive interface for soil analysis, crop planning, fertilizer guidance, weather-based decision support, community interaction, and administrative monitoring.

The application is built as a React + TypeScript frontend using Vite and is designed to work with a backend through a centralized API layer. The UI is polished, modular, and role-based, with separate experiences for farmers and admins.

---

## 2. Purpose of the Frontend

The frontend serves as the primary interaction layer between users and the AI-driven agricultural system. Its responsibilities include:

- presenting the platform to new users through a marketing-style landing page,
- supporting user authentication and session management,
- enabling AI-driven analysis workflows such as soil classification and recommendations,
- displaying dashboards and analytics in a readable and actionable way,
- providing chatbot-based support for farmers,
- allowing admins to oversee platform usage, trends, and user activity.

---

## 3. Target Users

### Farmer Users
Farmers use the system to:
- understand soil health and crop suitability,
- receive recommendations for crops and fertilizers,
- analyze weather conditions,
- consult an AI chatbot,
- review their analysis history,
- participate in community-related activities.

### Administrator Users
Administrators use the system to:
- monitor overall platform health,
- track user growth and prediction activity,
- view analytics and reporting information,
- manage community-related insights,
- monitor feedback and platform-level activity.

---

## 4. Core Features

### 4.1 Landing Experience
The first impression of the platform is a modern, visually rich landing page that introduces the product and highlights key benefits.

Key capabilities include:
- hero section with product messaging,
- feature cards,
- statistics highlighting platform impact,
- FAQ and testimonial sections,
- responsive mobile navigation,
- light/dark theme toggle,
- multilingual switcher support.

### 4.2 Authentication and Access Flow
The app includes a complete auth experience with:
- login,
- registration,
- forgot-password style flow,
- guest trial flow,
- protected app state transitions.

Authentication state is managed via the auth context and persisted through local storage.

### 4.3 Farmer Dashboard
The farmer dashboard acts as the home screen for end users. It provides:
- a greeting and contextual overview,
- weather summary,
- prediction statistics,
- quick action buttons for key modules,
- recent prediction cards,
- chart-based analytics,
- notifications summary.

### 4.4 AI Modules
The frontend contains dedicated interfaces for several AI-driven modules.

#### Soil Classification
Allows users to:
- upload an image of soil,
- drag and drop files,
- capture photos from the camera,
- view loading and processing states,
- see classification results with details and recommended crops.

#### Crop Recommendation
Provides recommendations based on user input and analysis context.

#### Fertilizer Recommendation
Offers fertilizer suggestions tailored to crop and soil conditions.

#### Disease Detection
This functionality exists as an optional feature flag and can be enabled when the backend supports it. In the current configuration, it is disabled by default.

### 4.5 AI Chatbot
The chatbot interface provides a conversational AI companion for farmers. It supports:
- chat bubbles for user and assistant messages,
- suggested prompts,
- multilingual language selection,
- markdown rendering of responses,
- feedback mechanisms,
- copy-to-clipboard support,
- session-based chat history.

### 4.6 Community and Social Features
The frontend includes community-related modules that allow users to interact with the broader agriculture ecosystem through the UI.

### 4.7 History and Notifications
Users can review past predictions and activity and receive notification-related updates through dedicated pages.

### 4.8 Admin Experience
Admins get a separate dashboard experience focused on:
- user growth analytics,
- crop and soil trend charts,
- system health indicators,
- admin-specific navigation.

---

## 5. Technology Stack

### Core Frontend Stack
- React for UI rendering
- TypeScript for type safety and maintainability
- Vite for fast development and build tooling
- Tailwind-style utility-based UI styling through custom class definitions
- Recharts for charts and data visualization
- Axios for HTTP requests
- React Query for async data and cache handling
- Lucide React for icons

### Supporting Libraries
- React DOM
- React Markdown for rendered content
- Remark GFM for markdown formatting support

---

## 6. Application Architecture

### 6.1 App Bootstrap
The application starts in [src/main.tsx](src/main.tsx), where the root React tree is created and providers are wrapped around the app.

The main providers include:
- QueryClientProvider for server-state management,
- AuthProvider for authentication state,
- TranslationProvider for multilingual content,
- LanguageProvider for language selection state,
- BrowserRouter for routing context.

### 6.2 Main Application Shell
The app shell is defined in [src/App.tsx](src/App.tsx). This is the central orchestrator for:
- splash screen handling,
- theme state,
- authentication state transitions,
- sidebar and navbar rendering,
- page-level rendering based on the current page state,
- global notification count management,
- logout behavior.

### 6.3 Role-based UI Model
The app uses a simple but effective role model:
- farmer role: full farmer experience
- admin role: admin dashboard and management routes

The UI changes based on the user role and current page selection.

### 6.4 Page-Based Component Structure
The app pages are organized under [src/pages](src/pages), including:
- LandingPage
- AuthPages
- FarmerDashboard
- AdminDashboard
- AIModules
- AIChatbot
- MorePages
- About
- GuestExperience
- FarmerCommunity

### 6.5 Shared Components
Shared UI pieces are housed under [src/components](src/components), including:
- Sidebar
- Navbar
- StatCard
- FloatingChatbot
- UI primitives such as cards, buttons, badges, inputs, and progress bars

---

## 7. Folder Structure

The frontend project is organized as follows:

- [src](src) — main application source directory
- [src/api](src/api) — API services and client wrappers
- [src/components](src/components) — reusable UI and layout components
- [src/contexts](src/contexts) — global context providers
- [src/hooks](src/hooks) — custom hooks for reusable logic
- [src/pages](src/pages) — feature-based screens and page components
- [src/services](src/services) — local services such as weather integration helpers
- [src/types](src/types) — TypeScript interfaces and shared models
- [src/utils](src/utils) — helper and formatter functions
- [src/validators](src/validators) — validation logic
- [src/config](src/config) — environmental and feature configuration
- [src/data](src/data) — static or offline data helpers
- [src/i18n](src/i18n) — translation and localization support

---

## 8. State and Data Flow

### 8.1 Authentication State
Authentication is managed through [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx). It provides:
- current user details,
- login/logout actions,
- loading state,
- refetch behavior,
- profile update support,
- location auto-save capability.

### 8.2 API Communication
HTTP communication is centralized in [src/api/client.ts](src/api/client.ts). The client:
- creates an Axios instance,
- attaches JWT tokens to requests,
- adds language headers,
- handles token refresh logic,
- redirects users on auth failures.

### 8.3 Local Storage Usage
The app stores important session and preference data locally for a smoother user experience, including:
- access tokens,
- refresh tokens,
- preferred language,
- theme selection,
- active chat session IDs,
- weather/location preferences.

### 8.4 UI State Management
Most page-level state is handled within component state using React hooks. The app uses:
- useState for local UI state,
- useEffect for lifecycle events and data fetching,
- useRef for DOM and interaction control,
- custom hooks for repeated logic.

---

## 9. Key Frontend Flows

### 9.1 App Launch Flow
1. The app initializes in [src/main.tsx](src/main.tsx).
2. Providers are mounted.
3. The app enters the splash screen in [src/App.tsx](src/App.tsx).
4. The user is routed to the landing page, auth flow, or app shell based on authentication state.

### 9.2 Login and Session Flow
1. The user enters credentials.
2. Auth context stores the session token.
3. The app fetches the extended profile.
4. The UI transitions to the app shell.
5. The dashboard loads based on role.

### 9.3 Soil Analysis Flow
1. The user opens the soil classification module.
2. They upload or capture an image.
3. The app validates the file.
4. A processing state is shown.
5. The AI prediction result is rendered.
6. The UI displays crop suggestions and soil insights.

### 9.4 Chatbot Flow
1. The user opens the chatbot.
2. The welcome message is shown.
3. The user types a prompt or chooses a suggestion.
4. The message is sent through the dedicated chat API.
5. The assistant response is rendered with markdown formatting.
6. The user can provide feedback or copy the conversation.

### 9.5 Admin Dashboard Flow
1. Admin enters the app.
2. The admin dashboard requests analytics data from the API.
3. Cards and charts render the latest metrics.
4. The admin can navigate to reports, community analytics, or user management.

---

## 10. UI/UX Design Characteristics

The frontend places strong emphasis on clarity, visual quality, and interactive feedback.

### Visual Style
- bright, modern agricultural theme,
- green-based color palette,
- card-based information layout,
- soft shadows and rounded surfaces,
- animated transitions and motion feedback,
- responsive spacing and layout.

### User Experience Design Patterns
- quick action buttons,
- clear empty states,
- breadcrumb navigation,
- stat cards for fast scanning,
- charts for high-level insights,
- loading states during AI requests,
- accessible and touch-friendly form controls.

### Theme Support
The app supports both dark and light modes through theme state and class-based styling.

---

## 11. Environment Configuration

The frontend expects environment variables to be configured for API access. The configuration is read through the environment config module.

Typical variables include:
- API base URL,
- upload URL,
- socket/WebSocket URL if used by the backend integration layer.

These are important for ensuring the frontend can connect to the correct backend services.

---

## 12. Setup and Running the Frontend

### Prerequisites
- Node.js and npm or pnpm
- A compatible backend service that exposes the expected API endpoints

### Install dependencies
```bash
cd Frontend
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## 13. Frontend Components by Area

### 13.1 Navigation and Layout
- Sidebar for primary navigation
- Navbar for top-level actions and page context
- Responsive behavior for mobile and desktop screens

### 13.2 Data Presentation
- Stat cards for quick metrics
- Recharts-based charts for trends and distributions
- Cards for grouped content and actions

### 13.3 Input and Interaction Controls
- upload areas,
- file pickers,
- buttons,
- dropdowns,
- text selectors,
- feedback controls.

### 13.4 AI Interaction Components
- upload/processing result UI,
- chatbot conversation panel,
- real-time state transitions for model analysis.

---

## 14. Integration with Backend

The frontend communicates with the backend through a dedicated API layer in [src/api](src/api). Each domain module has its own service wrapper, such as:
- auth APIs,
- analysis APIs,
- dashboard APIs,
- notification APIs,
- fertilizer APIs,
- chat APIs,
- weather APIs,
- admin APIs.

This separation makes the frontend modular and easier to evolve as the backend changes.

---

## 15. Strengths of the Current Frontend

- clear separation of UI and API logic,
- strong role-based experience,
- good visual polish and presentation,
- modular structure for future feature expansion,
- modern tooling with React and TypeScript,
- well-organized dashboards and AI workflows,
- support for multilingual and theme-based experience.

---

## 16. Current Limitations and Improvement Areas

While the frontend is well-structured, a few areas can be improved further:

- reducing duplication between older JavaScript-based pages and newer TypeScript-based components,
- standardizing the routing approach if the app evolves further,
- consolidating more UI logic into shared components,
- improving automated test coverage,
- adding stronger form validation and error handling patterns,
- increasing code reuse for repetitive page sections,
- improving documentation for each page module.

---

## 17. Suggested Future Enhancements

Possible future improvements include:
- adding unit and integration tests,
- introducing a more formal design system,
- improving accessibility audit coverage,
- adding deeper internationalization management,
- introducing a central state management library if the app grows further,
- adding skeleton loaders and more robust loading patterns,
- improving offline and retry behaviors for network failures.

---

## 18. Summary

The frontend of this project is a polished, role-based, AI-enabled web application designed to make agricultural intelligence accessible and actionable. It combines modern UI design, modular React architecture, and feature-rich dashboards to deliver a complete experience for both farmers and administrators.

In short, the frontend is not just a visual layer—it is the primary product experience that allows users to interact with the platform’s AI capabilities in an intuitive and meaningful way.
