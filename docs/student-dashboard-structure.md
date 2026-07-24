# Student Dashboard Structure

This scaffold is prepared for a React + Tailwind CSS + shadcn/ui campus event portal with auth and a student dashboard.

## Planned sections

- Login page
- Signup page
- Left collapsible sidebar
- Top navbar
- Welcome hero section
- Statistics cards
- Category filter chips
- Upcoming event cards
- My registrations panel
- Recent announcements section

## Recommended folder layout

```text
src/
  app/
    App.tsx
    providers.tsx
  components/
    auth/
      AuthLayout.tsx
      LoginForm.tsx
      PasswordField.tsx
      SignupForm.tsx
      SocialAuthButtons.tsx
      index.ts
    dashboard/
      AnnouncementCard.tsx
      CategoryFilterChips.tsx
      DashboardLayout.tsx
      EventCard.tsx
      Navbar.tsx
      RegistrationCard.tsx
      Sidebar.tsx
      StatsCard.tsx
      WelcomeHero.tsx
      index.ts
    ui/
      README.md
  data/
    auth.ts
    dashboard.ts
  lib/
    utils.ts
    validators/
      auth.ts
  pages/
    auth/
      index.ts
      login.tsx
      signup.tsx
    student-dashboard/
      index.tsx
  styles/
    globals.css
  types/
    auth.ts
    dashboard.ts
```
