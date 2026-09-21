# Fully responsive EduGestión layout

## Goal
Keep the current mobile experience intact while adding purposeful tablet and desktop layouts across sign-in, dashboard, courses, students, profile, dialogs, and navigation.

## Changes
- Replace the phone-width application wrapper with a responsive shell:
  - existing compact top bar and bottom navigation on mobile
  - persistent left navigation and full-width top bar on desktop
  - centered content with readable maximum widths on wide screens
- Adapt each screen for available space:
  - dashboard metrics and announcements use multi-column desktop grids
  - courses and students display cards in balanced responsive grids
  - headings, filters, search, and actions wrap safely on narrow screens
  - profile and assistant panels fill the available workspace cleanly
- Improve the sign-in screen for desktop with a branded information panel beside the form, while retaining the current single-column mobile screen.
- Present forms as bottom sheets on mobile and centered dialogs on larger screens.
- Preserve all authentication, filters, buttons, modals, and current Spanish content.

## Validation
- Check signed-out and signed-in layouts at mobile, tablet, and desktop widths.
- Verify navigation, course/student dialogs, overflow, and text wrapping.
- Confirm the preview has no build, console, or runtime errors.

## Technical details
- Use existing design tokens and Button components.
- Apply responsive Tailwind breakpoints without changing backend or authentication behavior.
- Keep fixed navigation dimensions stable so content never sits underneath it.
