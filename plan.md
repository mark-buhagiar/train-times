# Plan

This document outlines the implementation plan for the Train Times iOS app.

---

## Overview

| Attribute        | Value                                     |
| ---------------- | ----------------------------------------- |
| Project          | Train Times                               |
| Platform         | iOS (Expo / React Native)                 |
| Architecture     | Bulletproof React                         |
| State Management | Zustand + MMKV                            |
| Styling          | NativeWind (Tailwind)                     |
| Data Fetching    | TanStack Query                            |
| Testing          | Jest + React Native Testing Library + MSW |

---

## Phases

### Phase 1: Project Setup & Foundation ✅

**Goal**: Establish project structure, tooling, and core infrastructure.

- [x] Initialize Expo project with TypeScript
- [x] Configure NativeWind (Tailwind CSS)
- [x] Set up Bulletproof React folder structure
- [x] Configure environment variables (.env) for API keys
- [x] Set up Zustand store with MMKV persistence
- [x] Configure TanStack Query
- [x] Set up ESLint, Prettier
- [x] Configure MSW for API mocking in tests
- [x] Create base theme/design tokens from styles.prd.md

### Phase 2: Core Layout & Navigation ✅

**Goal**: Build the app shell with tab navigation.

- [x] Implement splash screen with concentric circles design
- [x] Create tab navigator (Home, My Services, Settings)
- [x] Build shared layout component with title bar
- [x] Implement base UI components:
  - [x] Button (Primary, Secondary, with haptics)
  - [x] TextInput (with clearable support)
  - [x] Card (with PressableCard variant)
  - [x] StatusBadge (on-time, delayed, cancelled, etc.)
  - [x] Skeleton loader (with preset variants)

### Phase 3: Enable the app to work on Web as well ✅

**Goal**: Make the app run seamlessly on web browsers alongside iOS.

- [x] Install and configure `@expo/metro-runtime` for web support
- [x] Add `react-native-web` and `react-dom` dependencies
- [x] Configure Metro bundler for web platform
- [x] Create platform-specific MMKV adapter (use localStorage on web)
- [x] Handle haptics gracefully on web (no-op or alternative)
- [x] Test all existing screens render correctly on web
- [x] Add web-specific viewport meta tags in app.json

### Phase 4: Stations Data & Autocomplete ✅

**Goal**: Fetch and search station data.

- [x] Create API service for fetching stations list
- [x] Implement stations data caching with TanStack Query
- [x] Build StationAutocomplete component
  - [x] Search by CRS code and station name
  - [x] Keyboard-friendly with proper dismiss behavior
  - [x] Recent selections (stored in MMKV)

### Phase 5: Home Screen ✅

**Goal**: Complete search functionality.

- [x] Build Home screen layout
- [x] Implement "From" station selector
- [x] Implement "To" station selector
- [x] Implement "When" time picker (-3h to +24h)
- [x] Build Search button with loading state
- [x] Navigate to Services list on search
- [x] Store recent searches in MMKV

### Phase 6: Services List ✅

**Goal**: Display train services from search results.

- [x] Create API service for station timetable
- [x] Build Services screen
- [x] Implement ServiceCard component
  - [x] Display departure time, destination, platform, status
  - [x] Status badges (on time, delayed, cancelled)
- [x] Handle loading and error states
- [x] Pull-to-refresh functionality

### Phase 7: Service Detail

**Goal**: Show detailed service information with stops.

- [ ] Create API service for service timetable
- [ ] Build Service detail screen
- [ ] Display full stops list with highlighting for FROM/TO
- [ ] Show platform and expected times
- [ ] Implement "Add to Favourites" action
  - [ ] Store service template URL in MMKV
  - [ ] Haptic feedback on save

### Phase 8: My Services (Favourites)

**Goal**: Manage and display saved services.

- [ ] Build My Services screen
- [ ] Load favourite services from MMKV
- [ ] Fetch live data for each favourite (with date substitution)
- [ ] Implement remove from favourites
  - [ ] Swipe-to-delete
  - [ ] Long-press menu option
- [ ] Empty state with prompt to add services

### Phase 9: Settings

**Goal**: User preferences management.

- [ ] Build Settings screen
- [ ] Implement favourite stations multi-select
- [ ] Persist settings in MMKV
- [ ] Add app version/info section

### Phase 10: UI/UX Polish ✅

**Goal**: Make UI and UX really polished and up to modern standard of high quality apps.

- [x] Add smooth animations and transitions between screens
- [x] Implement micro-interactions (button press feedback, loading states)
- [x] Add pull-to-refresh with custom animation
- [x] Implement skeleton loaders for all loading states
- [x] Add subtle shadows and depth to cards/surfaces
- [x] Ensure consistent spacing and typography throughout
- [x] Add empty states with helpful illustrations
- [x] Implement swipe gestures where appropriate
- [ ] Add keyboard shortcuts for web
- [x] Ensure smooth 60fps scrolling and animations
- [x] Add loading indicators for async actions
- [x] Implement toast/snackbar notifications for feedback
- [x] Review and refine all touch targets (min 44pt)
- [x] Add subtle hover states for web
- [x] Ensure responsive layout works beautifully at all sizes

### Phase 11: Testing & Quality

**Goal**: Ensure quality and robustness.

- [ ] Write unit tests for utility functions
- [ ] Write component tests with React Native Testing Library
- [ ] Write integration tests for key flows using MSW
- [ ] Accessibility audit and fixes
- [ ] Performance optimization
- [ ] Error boundary implementation

### Phase 12: Theming System

**Goal**: Enable customizable themes and potential light/dark mode.

- [ ] Create theme context provider for runtime theme switching
- [ ] Implement light theme color palette
- [ ] Add theme selection to Settings screen
- [ ] Persist theme preference in MMKV
- [ ] Support system theme preference detection
- [ ] Update StatusBar style based on theme
- [ ] Test all components with both themes

### Phase 13: Future (Not in Initial Scope)

**Goal**: Planned for later iterations.

- [ ] iOS home screen widgets (Expo or Swift)
- [ ] Backend server (Node.js)
- [ ] User accounts (Google/Apple Sign-In)
- [ ] Cloud sync for favourites
- [ ] Push notifications for service updates

---

## Folder Structure (Bulletproof React)

```
src/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation group
│   │   ├── index.tsx      # Home screen
│   │   ├── my-services.tsx
│   │   └── settings.tsx
│   ├── services/          # Services stack
│   │   ├── index.tsx      # Services list
│   │   └── [id].tsx       # Service detail
│   └── _layout.tsx        # Root layout
├── components/            # Shared UI components
│   ├── ui/               # Base components (Button, Input, etc.)
│   └── features/         # Feature-specific components
├── features/             # Feature modules
│   ├── search/           # Home search feature
│   ├── services/         # Services list/detail
│   ├── favourites/       # My Services feature
│   └── settings/         # Settings feature
├── lib/                  # Utilities and configurations
│   ├── api/             # API client setup
│   ├── storage/         # MMKV setup
│   └── utils/           # Helper functions
├── stores/              # Zustand stores
├── hooks/               # Custom hooks
├── types/               # TypeScript types
└── test/                # Test utilities and MSW handlers
```

---

## API Integration

### Environment Variables

```
EXPO_PUBLIC_TRANSPORT_API_APP_ID=xxx
EXPO_PUBLIC_TRANSPORT_API_APP_KEY=xxx
```

### Endpoints

| Endpoint                                                     | Purpose               |
| ------------------------------------------------------------ | --------------------- |
| `GET crs.codes/data/stations.json`                           | Fetch all UK stations |
| `GET transportapi.com/.../station_timetables/{crs}.json`     | Station departures    |
| `GET transportapi.com/.../service_timetables/{service}.json` | Service details       |

---

## State Management

### Zustand Stores

1. **searchStore**: Current search parameters (from, to, when)
2. **favouritesStore**: Persisted favourite services
3. **settingsStore**: User preferences (favourite stations)
4. **stationsStore**: Cached stations list

### MMKV Persistence

- Favourite services (with template URLs)
- Favourite stations
- Recent searches
- User settings

---

## Testing Strategy

### Unit Tests

- Utility functions (date formatting, URL templating)
- Zustand store actions

### Component Tests

- UI components render correctly
- User interactions work as expected
- Proper accessibility attributes

### Integration Tests (with MSW)

- Search flow: select stations → search → view results
- Favourite flow: view service → add favourite → see in My Services
- Settings flow: add/remove favourite stations

### MSW Handlers

```typescript
// Mock responses for:
- stations.json
- station_timetables/*.json
- service_timetables/*.json
```

---

## Getting Started

When ready to begin implementation, start with **Phase 1** by running:

```bash
npx create-expo-app@latest train-times --template tabs
cd train-times
```

Then follow the tasks in each phase sequentially, checking off items as completed.

---

## Notes for AI Agents

1. Reference `styles.prd.md` for all visual decisions
2. Reference individual `*.prd.md` files for feature requirements
3. Use MSW for all API mocking in tests
4. Persist all user data with MMKV (no backend in Phase 1-9)
5. Follow Bulletproof React architecture patterns
6. Keep components small and focused
7. Write tests alongside implementation
