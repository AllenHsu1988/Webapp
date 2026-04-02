# Tailwind CSS v4 — Critical Rule

When using Tailwind CSS v4, NEVER add manual CSS resets like `* { padding: 0; margin: 0 }` in globals.css outside of a `@layer`. Tailwind v4's `@import "tailwindcss"` already includes a complete CSS reset in `@layer base`. Adding unlayered CSS resets will override ALL Tailwind utility classes (`px-*`, `py-*`, `p-*`, `m-*`, etc.) because unlayered styles have higher CSS specificity than any `@layer`. The globals.css should only contain `@import "tailwindcss"` and any custom styles wrapped in proper `@layer` directives.
