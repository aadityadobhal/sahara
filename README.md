# 🚨 Sahara — Offline-First Emergency & Disaster Response PWA

[![TypeScript](https://img.shields.io/badge/TypeScript-98.5%25-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Offline--Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Built for rapid crisis management during network grid collapses, floods, and natural disasters.

**Sahara** is a lightweight, mobile-first Progressive Web Application (PWA) designed to operate under zero-connectivity conditions. When telecommunication towers fail, Sahara empowers citizens and relief teams with pre-cached vector maps, deterministic safe-zone routing, emergency audio guides, and localized SOS broadcasts[cite: 1].

---

## ⚡ The Problem Sahara Solves

During severe crises (such as flash floods or earthquakes), cellular infrastructure often goes down within hours. Civilians lose access to online navigation, shelter directories, and communication channels.

**Sahara** addresses this single point of failure by decoupling critical emergency services from internet connectivity[cite: 1]:
- Cached emergency maps and shelter locations[cite: 1].
- Browser-based routing with zero remote API dependencies[cite: 1].
- Automated location capture and resilient SOS packet queuing[cite: 1].

---

## 🌟 Key Features

* **🗺️ Zero-Data Safe Routing:** In-browser navigation using pre-loaded OpenStreetMap (`.osm`) extracts, enabling accurate pathfinding to safety when cellular data is unavailable[cite: 1].
* **🆘 One-Tap SOS Broadcast:** Immediate distress signal creation with GPS coordinates, critical needs tagging (medical, rescue, food/water), and persistent local state[cite: 1].
* **🏠 Real-Time Relief Shelter Locator:** Filterable directory of designated rescue shelters showing capacity, available resources, and direct navigation paths[cite: 1].
* **👨‍👩‍👧 Family Safety Status:** Localized check-ins to monitor family members' last-known locations and safety statuses during evacuations[cite: 1].
* **🔊 Multilingual Emergency Guides:** Survival workflows and audio instructions in Hindi and English for accessible, hands-free guidance under stress[cite: 1].
* **📦 Resilient PWA Architecture:** Zero mandatory store download; installs instantly to mobile home screens and aggressively caches assets via Service Workers[cite: 1].

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build & Tooling** | [Vite](https://vitejs.dev/)[cite: 1] |
| **Routing** | [TanStack Router](https://tanstack.com/router)[cite: 1] |
| **Styling & Components**| [Tailwind CSS](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons[cite: 1] |
| **Offline & Storage** | Service Worker Cache API, IndexedDB / LocalStorage, OpenStreetMap XML[cite: 1] |
| **Audio & Speech** | Web Speech API & pre-bundled local emergency audio tracks[cite: 1] |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+) installed:

```bash

Installation & Run
Clone the repository:

Bash
git clone [https://github.com/aadityaDobhal/sahara.git](https://github.com/aadityaDobhal/sahara.git)
cd sahara
Install project dependencies:

Bash
npm install
Start the local development server:

Bash
npm run dev
Build for production:

Bash
npm run build
📁 Repository Structure
Plaintext
sahara/
├── public/
│   ├── audio/           # Multilingual emergency voice guides (hi/en)
│   ├── maps/            # Pre-cached OpenStreetMap extracts (.osm)
│   └── sw.js            # Service worker for offline asset caching
├── src/
│   ├── components/
│   │   ├── resq/        # Core disaster workflows (SOS, Shelters, Map, Guides)
│   │   └── ui/          # Accessible UI primitives & layout components
│   ├── hooks/           # Custom hooks (speech synthesis, responsive layout)
│   ├── lib/             # Routing engines, offline storage stores & utilities
│   ├── routes/          # File-based TanStack route definitions
│   └── styles.css       # Global styling & Tailwind directives
└── vite.config.ts       # Build configuration


👥 Contributors
Aaditya Dobhal (@aadityaDobhal) — Core architecture, offline routing integration, and emergency UI workflows.
Ansh — Frontend development, disaster workflows, and component design.

Faiz — Shelter features, navigation mapping, and UI implementation.

Sanskar — PWA configuration, offline emergency guides, and testing.
node -v
npm -v
