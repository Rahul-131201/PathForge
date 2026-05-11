# Dark Mode / Light Mode Implementation

## Overview
The application now supports switching between dark mode and light mode with persistent user preferences.

## Features
✅ **Theme Toggle Button** - Located in:
- Landing navbar (desktop view with other CTA buttons)
- Landing navbar mobile menu
- Dashboard top bar

✅ **Persistent Theme Selection** - Theme preference is saved to localStorage and restored on next page load

✅ **CSS-based Color System** - Theme colors defined using CSS custom properties for easy customization

✅ **Smooth Transitions** - Color transitions animate smoothly when switching themes

## How It Works

### Architecture

1. **ThemeProvider** (`src/components/shared/theme-provider.tsx`)
   - React Context that manages theme state (dark/light)
   - Handles localStorage persistence
   - Initializes theme on component mount
   - Prevents flash of wrong theme by deferring render until hydration is complete

2. **ThemeToggle Component** (`src/components/shared/theme-toggle.tsx`)
   - Client component that renders theme toggle button
   - Shows Sun icon in dark mode, Moon icon in light mode
   - Uses `useTheme` hook to access toggle functionality
   - Accessible button with proper ARIA labels

3. **CSS Themes** (`src/app/globals.css`)
   - **Dark Theme** (`:root`) - Default theme with dark background and light foreground
   - **Light Theme** (`html.light`) - Light background with dark foreground
   - Applies to all semantic color tokens (background, foreground, card, muted, etc.)

4. **Layout Integration** (`src/app/layout.tsx`)
   - Root layout wrapped with ThemeProvider
   - Toaster component configured for both themes

### Color Palettes

#### Dark Mode
- Background: `#050510` (Deep dark purple)
- Foreground: Light gray (`hsl(213 31% 91%)`)
- Primary: Purple-blue (`hsl(239 84% 67%)`)
- Secondary: Cyan (`hsl(192 91% 53%)`)
- Accent: Violet (`hsl(271 91% 65%)`)
- Muted: Dark gray (`hsl(217 33% 11%)`)

#### Light Mode
- Background: White (`#ffffff`)
- Foreground: Dark gray (`hsl(220 9% 20%)`)
- Primary: Purple-blue (`hsl(239 84% 57%)`)
- Secondary: Cyan (`hsl(192 91% 43%)`)
- Accent: Violet (`hsl(271 91% 55%)`)
- Muted: Light gray (`hsl(220 13% 91%)`)

## Component Usage

### Using the Theme Toggle

The `ThemeToggle` component is already integrated in:

1. **Landing Navbar** - Appears next to Sign In/Get Started buttons
2. **Dashboard Top Bar** - Appears next to the auth button  
3. **Mobile Menu** - Available in the mobile navigation

### Using Theme Context in Custom Components

```tsx
import { useTheme } from '@/components/shared';

export function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## CSS Customization

### Adding Theme-Specific Styles

```css
/* Automatically applies correct colors based on current theme */
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Theme-specific overrides */
.dark .my-special-element {
  opacity: 0.9;
}

.light .my-special-element {
  opacity: 0.8;
}
```

### Glassmorphism

The glass effect automatically adapts to the theme:

```css
/* Dark mode: light semi-transparent overlay */
.dark .glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Light mode: dark semi-transparent overlay */
.light .glass {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
```

## Testing the Feature

### Manual Testing
1. Navigate to `/` or `/explore`
2. Look for the theme toggle button in the header (sun/moon icon)
3. Click the button to toggle between light and dark modes
4. The entire UI should transition smoothly to the new theme
5. Refresh the page - your theme preference should be restored

### On Mobile
1. Open the hamburger menu (three lines icon)
2. Look for the theme toggle button in the mobile menu
3. Click to toggle themes
4. Close the menu - theme is applied

### Verify Persistence
1. Toggle to light mode
2. Close the browser or navigate away
3. Return to the site
4. Light mode should be restored

## Files Modified

- ✅ `src/app/globals.css` - Added light theme CSS variables
- ✅ `src/app/layout.tsx` - Added ThemeProvider wrapper
- ✅ `src/components/shared/index.ts` - Exported theme utilities  
- ✅ `src/components/landing/navbar.tsx` - Added ThemeToggle button
- ✅ `src/components/dashboard/DashboardTopBar.tsx` - Added ThemeToggle button

## Files Created

- ✅ `src/components/shared/theme-provider.tsx` - Theme context and provider
- ✅ `src/components/shared/theme-toggle.tsx` - Toggle button component

## Browser Support

Works in all modern browsers that support:
- CSS Custom Properties (CSS Variables)
- localStorage API
- React 19+

## Future Enhancements

Possible improvements:
1. Add system preference detection (respects `prefers-color-scheme`)
2. Add theme selector with more options (auto/dark/light)
3. Add animated transitions between themes
4. Add per-page theme overrides
5. Add theme preview before applying

## Troubleshooting

### Theme button not visible
- Ensure you're viewing on a screen width ≥ 768px for desktop nav
- On mobile, open the hamburger menu to see the button
- Check browser console for any JavaScript errors

### Theme not persisting
- Verify localStorage is enabled in browser settings
- Check browser console for storage errors
- Clear localStorage if needed: `localStorage.clear()`

### Styling issues
- Ensure Tailwind CSS is properly compiled
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`

## Contact

For issues or questions about the theme implementation, check:
- CSS custom properties in `src/app/globals.css`
- Theme provider in `src/components/shared/theme-provider.tsx`
- Toggle component in `src/components/shared/theme-toggle.tsx`
