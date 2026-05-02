# 🏙️ WELCOMETOMYCITY: Technical Architecture Report
### *The Emotion-First City Operating System*
**Created by Rachit**

---

## 🏗️ 1. System Overview
WELCOMETOMYCITY is built on a **Map-First Canvas Architecture**. Unlike traditional travel apps that treat maps as a secondary widget, this platform utilizes the map as the primary viewport, with a layer of absolute-positioned, glassmorphism UI components floating above it.

### Core Architecture Principles:
- **Immersive Viewport**: Full-screen MapLibre canvas (`absolute inset-0`).
- **Asynchronous Data Layer**: Next.js 15 Server Components for secure, high-performance database fetching.
- **Stateful Intelligence**: Supabase-backed user persistence for bookmarks and itineraries.

---

## 🧠 2. The Experience Engine
The "brain" of the platform is the **Experience Engine**, which replaces traditional category filters with **Emotional Vibe Mapping**.

### Emotional Data Model
Every location in our curated Supabase dataset is scored across multiple emotional vectors:
- **Romantic**: Sunset-optimized, low-crowd, heritage-focused.
- **Peaceful**: High nature score, quiet zones.
- **Hidden Gem**: High "offbeat" score, curated by local intelligence.
- **Cultural**: Deep heritage and historical weighting.

### Scoring Logic (`lib/experience-engine.ts`)
The engine calculates a "Vibe Match" score for every location, allowing the UI to dynamically reorder and highlight spots that match the user's current mood.

---

## 🗺️ 3. Map Canvas System
We utilize **MapLibre GL JS** to deliver a high-performance, cinematic mapping experience.

- **The Dark Matter Layer**: A custom tileset optimized for our "Deep Space" theme.
- **Dynamic GeoJSON Routing**: Our itinerary generator doesn't just return a list; it injects a `LineString` GeoJSON layer into the map to draw glowing, animated paths between destinations.
- **Contextual Markers**: Custom HTML markers built with Framer Motion that pulse and glow based on their emotional category.

---

## 🛰️ 4. Data Flow & Backend
We transitioned from a static JSON architecture to a live **Supabase / PostgreSQL** backend.

### Server Actions Architecture
We utilize **Next.js Server Actions** for all data mutations (Saving places, Storing itineraries). This allows for:
- Zero-bundle-size mutations.
- Secure, server-side database access without exposing API keys to the browser.
- Optimistic UI updates for a snappy, high-end feel.

### Database Schema
- **`places`**: Curated city intelligence layer with metadata (hidden gem scores, best times, coordinates).
- **`saved_places`**: User-specific bookmarks.
- **`itineraries`**: Persisted multi-day journeys with full GeoJSON path data.

---

## 🎨 5. Design System: "Deep Space Glass"
Our design language is inspired by 2025 high-end AI SaaS dashboards.
- **Theme**: Persistent Dark Mode (`#05070B`).
- **Surface**: `backdrop-blur-xl` with `bg-white/5` (Glassmorphism).
- **Accents**: Neon Cyan, Indigo, and Rose to represent different city "vibes."
- **Typography**: Space Grotesk for a technical, modern aesthetic.

---

## 🚦 6. Current Implementation Status
- [x] **Phase 1-4**: Core UI, Experience Engine, and Map Canvas.
- [x] **Phase 5**: Supabase Auth & Dashboard.
- [x] **Phase 6**: Curated Data Layer (JSON to Postgres Migration).
- [ ] **Upcoming**: Real-time Transit API Integration.
- [ ] **Upcoming**: PWA Offline Support.

---

Built with care for the cities of India by **Rachit**
