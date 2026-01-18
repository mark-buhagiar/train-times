# Styles

This document defines the visual design system and UX guidelines for the Train Times app.

## Design Philosophy

- **Minimalistic**: Clean interfaces with purposeful elements only
- **Dark-first**: Optimized for dark environments and OLED screens
- **Glanceable**: Information should be scannable at a glance
- **Native feel**: Follow iOS design conventions and patterns

---

## Color Palette

### Primary Colors

| Name       | Hex       | Usage                                |
| ---------- | --------- | ------------------------------------ |
| Navy       | `#0A1628` | Primary background                   |
| Navy Light | `#1A2A44` | Card backgrounds, elevated surfaces  |
| Blue       | `#3B82F6` | Primary accent, interactive elements |
| Blue Light | `#60A5FA` | Secondary accent, highlights         |

### Semantic Colors

| Name    | Hex       | Usage                         |
| ------- | --------- | ----------------------------- |
| Success | `#22C55E` | On-time status, confirmations |
| Warning | `#F59E0B` | Delayed status, cautions      |
| Error   | `#EF4444` | Cancelled status, errors      |
| Info    | `#3B82F6` | Information, links            |

### Neutral Colors

| Name     | Hex       | Usage                      |
| -------- | --------- | -------------------------- |
| White    | `#FFFFFF` | Primary text               |
| Gray 100 | `#F3F4F6` | Secondary text             |
| Gray 300 | `#D1D5DB` | Tertiary text, borders     |
| Gray 500 | `#6B7280` | Placeholder text, disabled |
| Gray 700 | `#374151` | Subtle borders, dividers   |
| Gray 900 | `#111827` | Deep backgrounds           |

---

## Typography

Using system fonts for optimal performance and native feel.

| Style         | Size | Weight   | Line Height | Usage              |
| ------------- | ---- | -------- | ----------- | ------------------ |
| Title Large   | 28px | Bold     | 34px        | Screen titles      |
| Title         | 22px | Semibold | 28px        | Section headers    |
| Body Large    | 17px | Regular  | 22px        | Primary content    |
| Body          | 15px | Regular  | 20px        | Secondary content  |
| Caption       | 13px | Regular  | 18px        | Labels, timestamps |
| Caption Small | 11px | Medium   | 14px        | Badges, tags       |

---

## Spacing System

Using a 4px base unit:

| Token | Value | Usage                          |
| ----- | ----- | ------------------------------ |
| xs    | 4px   | Tight spacing, inline elements |
| sm    | 8px   | Related elements               |
| md    | 16px  | Standard padding               |
| lg    | 24px  | Section spacing                |
| xl    | 32px  | Large gaps                     |
| 2xl   | 48px  | Screen margins                 |

---

## Components

### Cards

- Background: `Navy Light (#1A2A44)`
- Border radius: 12px
- Padding: 16px
- Shadow: None (use elevation through color)

### Buttons

#### Primary Button

- Background: `Blue (#3B82F6)`
- Text: White, Body weight Semibold
- Border radius: 10px
- Height: 50px
- Pressed state: 90% opacity

#### Secondary Button

- Background: Transparent
- Border: 1px `Gray 500`
- Text: `Gray 100`
- Border radius: 10px
- Height: 50px

### Input Fields

- Background: `Navy Light (#1A2A44)`
- Border: 1px `Gray 700` (default), `Blue` (focused)
- Border radius: 10px
- Height: 50px
- Padding horizontal: 16px
- Placeholder color: `Gray 500`
- Text color: White

### Tab Bar

- Background: `Navy (#0A1628)`
- Active icon/text: `Blue (#3B82F6)`
- Inactive icon/text: `Gray 500`
- Height: 83px (including safe area)

### Lists

- Item height: Flexible, minimum 60px
- Separator: 1px `Gray 700`, inset 16px
- Press feedback: Subtle opacity change

### Status Badges

- Border radius: 6px
- Padding: 4px 8px
- Font: Caption Small, Semibold
- On Time: `Success` background at 20% opacity, `Success` text
- Delayed: `Warning` background at 20% opacity, `Warning` text
- Cancelled: `Error` background at 20% opacity, `Error` text

---

## Animations & Transitions

- **Duration**: 200ms for micro-interactions, 300ms for screen transitions
- **Easing**: `ease-out` for entrances, `ease-in` for exits
- **Loading states**: Skeleton screens with subtle shimmer effect
- **Pull to refresh**: Native iOS behavior

---

## Icons

Use SF Symbols or a compatible icon set (e.g., Lucide) for consistency with iOS.

| Context            | Icon                          |
| ------------------ | ----------------------------- |
| Home tab           | `house.fill` / `Home`         |
| My Services tab    | `star.fill` / `Star`          |
| Settings tab       | `gearshape.fill` / `Settings` |
| Search             | `magnifyingglass` / `Search`  |
| Favourite (empty)  | `star` / `Star`               |
| Favourite (filled) | `star.fill` / `StarFilled`    |
| Time               | `clock` / `Clock`             |
| Platform           | `number` / `Hash`             |
| Train              | `tram.fill` / `Train`         |

---

## UX Guidelines

### Loading States

- Show skeleton placeholders matching content layout
- Avoid spinners where possible
- Display cached data while refreshing

### Empty States

- Friendly illustration or icon
- Clear message explaining the state
- Action button when applicable

### Error States

- Explain what went wrong in plain language
- Offer a retry action
- Preserve user input where possible

### Haptic Feedback

- Light impact: Button presses
- Medium impact: Successful actions (add favourite)
- Error: Failed actions

### Accessibility

- Minimum touch target: 44x44px
- Support Dynamic Type
- VoiceOver labels for all interactive elements
- Sufficient color contrast (WCAG AA minimum)

---

## Screen-Specific Guidelines

### Home Screen

- Station inputs should be prominent and easy to tap
- Recent searches shown below for quick access
- Search button should be unmissable

### Services List

- Each service card shows: departure time, destination, platform, status
- Visual distinction for highlighted FROM/TO stations
- Quick-add favourite action

### My Services

- Grid or list layout based on number of items
- Easy swipe-to-delete or long-press menu
- Empty state encourages adding services

### Settings

- Grouped sections with clear headers
- Toggle switches for boolean options
- Chevron indicators for drill-down options
