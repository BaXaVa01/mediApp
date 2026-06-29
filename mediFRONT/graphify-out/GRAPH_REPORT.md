# Graph Report - mediFRONT  (2026-06-04)

## Corpus Check
- 77 files · ~238,858 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 295 nodes · 553 edges · 39 communities (23 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e38a77f9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Professional Agenda & Appointments|Professional Agenda & Appointments]]
- [[_COMMUNITY_Doctor & Patient Profiles|Doctor & Patient Profiles]]
- [[_COMMUNITY_Professional Profile Management|Professional Profile Management]]
- [[_COMMUNITY_Search & Location Services|Search & Location Services]]
- [[_COMMUNITY_User Authentication & Registration|User Authentication & Registration]]
- [[_COMMUNITY_System UI & State Management|System UI & State Management]]
- [[_COMMUNITY_Professional Configuration & Mock Data|Professional Configuration & Mock Data]]
- [[_COMMUNITY_Profile Logic & Services|Profile Logic & Services]]
- [[_COMMUNITY_Social Media & Documentation Icons|Social Media & Documentation Icons]]
- [[_COMMUNITY_Profile Component Architecture|Profile Component Architecture]]
- [[_COMMUNITY_Medical Professional Visuals|Medical Professional Visuals]]
- [[_COMMUNITY_Inclusive Healthcare Assets|Inclusive Healthcare Assets]]
- [[_COMMUNITY_Account Registration Flow|Account Registration Flow]]
- [[_COMMUNITY_Agenda Component Integration|Agenda Component Integration]]
- [[_COMMUNITY_Application Entry & Layout|Application Entry & Layout]]
- [[_COMMUNITY_Homepage Branding|Homepage Branding]]
- [[_COMMUNITY_React Visual Framework|React Visual Framework]]
- [[_COMMUNITY_Vite Build Metadata|Vite Build Metadata]]
- [[_COMMUNITY_MediFind Logo & Identity|MediFind Logo & Identity]]
- [[_COMMUNITY_Config Page Tracking|Config Page Tracking]]
- [[_COMMUNITY_Hero Illustrations|Hero Illustrations]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Auth Store|Auth Store]]
- [[_COMMUNITY_Sidebar Navigation|Sidebar Navigation]]
- [[_COMMUNITY_Appointment List View|Appointment List View]]
- [[_COMMUNITY_Calendar Dashboard|Calendar Dashboard]]
- [[_COMMUNITY_Appointment Rules Logic|Appointment Rules Logic]]
- [[_COMMUNITY_Reminders Logic|Reminders Logic]]
- [[_COMMUNITY_Professional Tablet Asset|Professional Tablet Asset]]
- [[_COMMUNITY_Surgeon Visual Asset|Surgeon Visual Asset]]
- [[_COMMUNITY_Community 38|Community 38]]

## God Nodes (most connected - your core abstractions)
1. `Button` - 25 edges
2. `useAgendaStore` - 19 edges
3. `useAuthStore` - 15 edges
4. `ProfileService` - 13 edges
5. `Doctor` - 13 edges
6. `useProfileStore` - 13 edges
7. `useConfigStore` - 13 edges
8. `delay()` - 12 edges
9. `AgendaService` - 7 edges
10. `useLocationStore` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Agenda Center Column (Calendar Grid)` --references--> `DailyCalendar`  [EXTRACTED]
  AI_LOG.md → src/components/professional/agenda/DailyCalendar.tsx
- `Agenda Center Column (Calendar Grid)` --references--> `AgendaPage`  [EXTRACTED]
  AI_LOG.md → src/pages/professional/AgendaPage.tsx
- `Configuration Page & Subtabs Layout` --references--> `ConfigPage`  [EXTRACTED]
  AI_LOG.md → src/pages/professional/ConfigPage.tsx
- `LoginPage()` --calls--> `useAuthStore`  [EXTRACTED]
  src/pages/LoginPage.tsx → src/store/authStore.ts
- `SearchPage()` --calls--> `useLocationStore`  [EXTRACTED]
  src/pages/SearchPage.tsx → src/store/locationStore.ts

## Hyperedges (group relationships)
- **Development Tasks** — ai_log_task_4, ai_log_task_6, ai_log_task_7 [EXTRACTED 1.00]
- **Integrated Medical Team** — homepageonbackground_doctor, homepageonbackground_professional_tablet, homepageonbackground_surgeon [INFERRED 0.85]

## Communities (39 total, 16 thin omitted)

### Community 0 - "Professional Agenda & Appointments"
Cohesion: 0.08
Nodes (27): AgendaFilterPanel(), AppointmentBlock(), AppointmentBlockProps, AppointmentDetailPanel(), CalendarGrid(), DailyCalendar(), MiniCalendar(), PendingRequestsDrawer() (+19 more)

### Community 1 - "Doctor & Patient Profiles"
Cohesion: 0.1
Nodes (25): AvailabilityPreview(), AvailabilityPreviewProps, SearchResultCardProps, CareLocationsTabs(), DoctorAvailabilityPanel(), DoctorExperienceCard(), GalleryGrid(), MoreInfoModal() (+17 more)

### Community 2 - "Professional Profile Management"
Cohesion: 0.14
Nodes (23): EmptyState(), LoadingState(), SaveToast(), ConfigPage(), ConfigState, useConfigStore, AppointmentRulesTab(), AvailabilityBlocksTab() (+15 more)

### Community 3 - "Search & Location Services"
Cohesion: 0.11
Nodes (10): RegisterClinicForm(), RegisterDoctorForm(), RegisterPatientForm(), Navbar(), LoginPage(), Sidebar(), Topbar(), AuthState (+2 more)

### Community 4 - "User Authentication & Registration"
Cohesion: 0.19
Nodes (17): PublicProfilePage(), EducationSection(), ExperienceSection(), ProfileContactForm(), ProfileIdentityForm(), ProfileImageUploader(), mockContact, mockEducation (+9 more)

### Community 5 - "System UI & State Management"
Cohesion: 0.15
Nodes (14): SearchResultCard(), DefaultIcon, SearchMap(), SearchMapProps, HomePage(), ProfilePage(), SearchPage(), LocationState (+6 more)

### Community 7 - "Profile Logic & Services"
Cohesion: 0.29
Nodes (7): bluesky-icon, discord-icon, documentation-icon, github-icon, public/icons.svg, social-icon, x-icon

### Community 8 - "Social Media & Documentation Icons"
Cohesion: 0.33
Nodes (5): code:js (export default defineConfig([), code:js (// eslint.config.js), Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 9 - "Profile Component Architecture"
Cohesion: 0.33
Nodes (6): Education Section, Experience Section, Profile Contact Form, Profile Identity Form, Profile Image Uploader, Profile Store

### Community 10 - "Medical Professional Visuals"
Cohesion: 0.33
Nodes (6): doctor.png, Professional Demeanor, Healthcare Professional, Clipboard, Stethoscope, White Coat

### Community 11 - "Inclusive Healthcare Assets"
Cohesion: 0.33
Nodes (6): Child with Rocket, Inclusive Healthcare Rationale, Doctor Figure, Elderly Patient, Family Unit (Father and Baby), Home Page Hero Illustration

### Community 13 - "Agenda Component Integration"
Cohesion: 0.5
Nodes (5): System States, Availability Blocks Tab, Pending Requests Tab, Weekly Schedule Tab, Config Store

### Community 14 - "Application Entry & Layout"
Cohesion: 0.5
Nodes (3): Professional Module Branding Update, Task 4: Agenda Center Column (Calendar Grid), Task 6: Configuration Page & Subtabs Layout

### Community 16 - "React Visual Framework"
Cohesion: 1.0
Nodes (3): AgendaPage, Agenda Center Column (Calendar Grid), DailyCalendar

### Community 17 - "Vite Build Metadata"
Cohesion: 0.67
Nodes (3): Homepage Hero Image, Community Healthcare, Home Page

### Community 18 - "MediFind Logo & Identity"
Cohesion: 0.67
Nodes (3): react-logo, src/assets/react.svg, svg-path-0

## Knowledge Gaps
- **43 isolated node(s):** `mockIdentity`, `mockContact`, `mockEducation`, `mockExperience`, `ApptStatus` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button` connect `Doctor & Patient Profiles` to `Professional Profile Management`, `Search & Location Services`, `User Authentication & Registration`, `System UI & State Management`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `ProfileService` connect `Professional Configuration & Mock Data` to `User Authentication & Registration`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `useAgendaStore` connect `Professional Agenda & Appointments` to `Professional Profile Management`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `mockIdentity`, `mockContact`, `mockEducation` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Professional Agenda & Appointments` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Doctor & Patient Profiles` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Professional Profile Management` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._