# My Journeys - Product Requirements Document

## Overview

Smart journey recommendations based on user location and time. Users can save their frequent journeys with context-aware rules that automatically surface relevant journeys on the home screen.

---

## Requirements

### Core Features

1. **New Tab**: "My Journeys" as 4th tab in navigation (Home | My Journeys | My Services | Settings)

2. **Journey Creation**:
   - Users can only create journeys by first making a search from the Home screen
   - After viewing services, option to "Save as Journey"
   - Journey stores: FROM station, TO station

3. **Recommendation Rules**:
   - Each journey can have multiple recommendation rules
   - Rules are editable/deletable
   - Rule parameters:
     - **Location** (optional): GPS coordinates + named location + radius
     - **Time window** (optional): Start time, End time
     - **Days of week** (optional): Mon, Tue, Wed, Thu, Fri, Sat, Sun
   - A rule can have location only, time only, or both

4. **Location Handling**:
   - Uses device GPS (requires location permissions)
   - Two ways to set location:
     - "Use current location" - captures current GPS + user names it
     - Map picker - drop a pin on a map
   - Configurable proximity radius per location (default: 200m)
   - Match when user is within radius of saved coordinates

5. **Priority/Ordering**:
   - When multiple journeys match current context, order by most recently used first

6. **Home Screen Integration**:
   - Display "Recommended Journeys" section before "Recent Searches"
   - Only shows journeys that match current time AND/OR location based on rules
   - Selecting a recommended journey pre-fills the FROM/TO stations on Home screen

7. **My Journeys Screen**:
   - List all saved journeys
   - Each journey shows:
     - FROM → TO stations
     - Number of recommendation rules
     - Quick indication if currently recommended
   - Tap to expand/edit rules
   - Swipe to delete (following existing pattern)

---

## Data Model

```typescript
interface SavedLocation {
  id: string;
  name: string; // e.g., "Home", "Office"
  latitude: number;
  longitude: number;
  radiusMeters: number; // default: 200
}

interface RecommendationRule {
  id: string;
  location?: SavedLocation; // optional
  timeStart?: string; // HH:mm format, optional
  timeEnd?: string; // HH:mm format, optional
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat, optional
}

interface SavedJourney {
  id: string;
  fromStation: Station; // { crs, name }
  toStation: Station;
  rules: RecommendationRule[];
  lastUsedAt: number; // timestamp for ordering
  createdAt: number;
}
```

---

## User Flows

### Flow 1: Creating a Journey

1. User searches for trains on Home screen (FROM: KDB, TO: CHX)
2. User views services list
3. User taps "Save Journey" button (in header or FAB)
4. Journey saved with no rules initially
5. User prompted to add recommendation rules (can skip)

### Flow 2: Adding a Recommendation Rule

1. User goes to My Journeys tab
2. Taps on a journey to expand
3. Taps "Add Rule"
4. Modal/sheet appears with options:
   - Location: [None] / [Select Location]
   - Time: [All day] / [Set time window]
   - Days: [Every day] / [Select days]
5. If selecting location:
   - "Use Current Location" button
   - "Pick on Map" button
   - Name the location
   - Set radius (slider, default 200m)
6. Save rule

### Flow 3: Using a Recommendation

1. User opens app
2. App checks current GPS location and time
3. Matches against all journey rules
4. Displays matching journeys in "Recommended" section on Home
5. User taps a recommendation
6. FROM and TO fields pre-fill
7. User taps Search (or app auto-searches)

---

## Technical Considerations

### Location Permissions

- Request "when in use" permission
- Graceful fallback if denied (only time-based rules work)
- Show permission prompt explanation

### Background Location

- NOT required for MVP
- Location only checked when app is opened/foregrounded

### Dependencies

- `expo-location` for GPS
- `react-native-maps` for map picker (optional, can defer)

---

## Implementation Phases

### Phase 1: Foundation

- [ ] Create journeysStore with Zustand + MMKV persistence
- [ ] Add "My Journeys" tab to navigation
- [ ] Build basic My Journeys screen (list journeys, add/delete)
- [ ] Add "Save Journey" action from Services screen

### Phase 2: Location & Rules

- [ ] Install and configure expo-location
- [ ] Build location picker component ("Use current" + manual entry)
- [ ] Build rule editor modal/sheet
- [ ] Implement rule matching logic

### Phase 3: Home Screen Integration

- [ ] Build "Recommended Journeys" section component
- [ ] Implement context matching (time + location)
- [ ] Pre-fill functionality when selecting recommendation
- [ ] Update lastUsedAt on selection

### Phase 4: Map Picker (Optional Enhancement)

- [ ] Add react-native-maps
- [ ] Build map picker component
- [ ] Allow dropping pin to set location

---

## UI/UX Notes

- Follow existing design patterns (glass cards, swipe to delete, etc.)
- Journey card should feel premium and informative
- Rule indicators should be subtle but clear (icons for location, clock, calendar)
- Empty state with illustration encouraging user to save first journey
