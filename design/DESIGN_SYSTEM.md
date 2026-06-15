# Agent Builder Design System

## Locked Reference
All designs lock to: `design/RHYTHMIX-BRAND.md`

## Tailwind Configuration
Primary config: `agent-builder/tailwind.config.ts`

## Component Library

### Buttons
```tsx
// Primary
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  Action
</button>

// Secondary
<button className="bg-gray-200 text-slate-900 px-4 py-2 rounded hover:bg-gray-300">
  Cancel
</button>

// Danger
<button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
  Delete
</button>
```

### Cards
```tsx
<div className="bg-white shadow-card rounded-lg p-6 hover:shadow-card-hover transition-shadow">
  {/* Content */}
</div>
```

### Forms
```tsx
<form className="space-y-4">
  <div>
    <label className="block font-bold text-sm text-slate-900 mb-2">
      Label
    </label>
    <input 
      type="text"
      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
      placeholder="Placeholder"
    />
  </div>
</form>
```

### Layout
- **Mobile-first**: Design for mobile, scale up
- **Max-width**: 1280px containers (2xl)
- **Spacing scale**: 0, 2, 4, 6, 8, 12, 16, 24, 32px (8px increments)

## Asset Storage
- Images: `agent-builder/public/images/`
- Icons: Use `lucide-react` (pre-installed)
- Logos: `design/assets/`

## QA Checklist
- [ ] Colors match brand palette
- [ ] Typography follows Inter/Monaco rules
- [ ] Responsive on mobile/tablet/desktop
- [ ] Touch targets ≥44px
- [ ] 4.5:1 color contrast minimum
- [ ] Animations ≤200ms

