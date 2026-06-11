---
name: design-arena
description: System design practice arena UI component. Interactive platform for solving system design problems (Twitter, Uber, URL Shortener, etc.) with difficulty levels, acceptance rates, and progress tracking. Dark-themed, terminal-inspired interface with sidebar navigation and filtering.
metadata:
  tags: system-design, learning-platform, ui, react, problem-solving
---

## When to use

User asks for:
- "Add a design arena interface"
- "Build a system design practice platform"
- "Create a problem library UI"
- "Design interview prep interface"

Perfect for:
- Learning system design architectures
- Tracking progress on design problems
- Organizing problems by difficulty and topic
- Interview preparation

## Component Features

- **Sidebar Navigation** — Collapsible sidebar with 10 navigation items (Mail, Webinars, CMD Center, Code Arena, Design Arena, Interviews, Contest, Profile, Projects, Recording)
- **Problem Library** — Table of 8+ system design problems with status tracking, difficulty levels, acceptance rates, and topic categorization
- **Topic Filtering** — Filter problems by: All, Distributed Systems, Databases, API Design, Microservices, Caching, Message Queues
- **Status Tracking** — Three states: Solved (✓), Attempted (◐), Unsolved (○)
- **Difficulty Levels** — Easy (green), Medium (yellow), Hard (red)
- **Search & Filter** — Real-time search, difficulty dropdown, status dropdown
- **User Profile** — Mini profile card showing student name and rank
- **Dark Theme** — Terminal-inspired dark UI with accent colors

## Installation

### Option 1: Direct Integration (React App)

```bash
# Copy component to your React project
cp design-arena.tsx src/pages/
# or
cp design-arena.tsx src/components/

# Add to your router
import DesignArena from '@/pages/DesignArena'

export const routes = [
  { path: '/student/designarena', element: <DesignArena /> },
  // ... other routes
]
```

### Option 2: Standalone Component

```tsx
import DesignArena from './DesignArena'

export default function App() {
  return <DesignArena />
}
```

## Dependencies

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.263.0"
}
```

Install with:
```bash
npm install framer-motion lucide-react
```

## Styling

Uses Tailwind CSS with custom accent color system:
- `accent-500`, `accent-400`, `accent-500/10` — Primary theme colors
- Dark background: `#050505`, `#0A0A0A`, `#111`
- Border colors: `#222`, `#333`
- Text: `#888`, `#aaa`
- Custom scrollbar styling included

## Data Structure

Problems array:
```typescript
interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
  acceptance: string // "45.2%"
  status: 'Solved' | 'Attempted' | 'Unsolved'
}
```

## Customization

### Change Problem Data

```tsx
const problems = [
  { id: '1', title: 'Your Problem', difficulty: 'Medium', topic: 'Your Topic', acceptance: '45.2%', status: 'Unsolved' },
  // ... more problems
];
```

### Change Topics

```tsx
const topics = [
  'All', 'Your Topic 1', 'Your Topic 2', 'Your Topic 3'
];
```

### Change Colors

Replace `accent-500` / `accent-400` with your brand color:
```tsx
// Change from accent-500 to blue-500
className="text-blue-500 border-blue-500/30 bg-blue-500/10"
```

### Change Navigation Items

```tsx
const sidebarItems = [
  { icon: YourIcon, label: 'Your Label', path: '/your/path' },
  // ... more items
];
```

## Features

### Status Icons
- ✓ Green checkmark: Solved
- ◐ Half circle: Attempted
- ○ Empty circle: Unsolved

### Difficulty Colors
- Green: Easy
- Yellow: Medium
- Red: Hard

### Filter & Search
- Real-time search by problem title
- Difficulty filter dropdown
- Status filter dropdown
- Topic-based filtering with count

### Responsive Design
- Sidebar collapses on smaller screens
- Mobile-friendly layout
- Flexible grid for different screen sizes

## API Integration

To connect to a backend:

```tsx
useEffect(() => {
  fetch('/api/problems')
    .then(res => res.json())
    .then(data => setProblems(data))
}, [])
```

## Routing

Default routes (change as needed):

```tsx
{
  path: '/student/designarena',
  element: <DesignArena />,
  children: [
    {
      path: '/student/designarena/:id',
      element: <DesignProblem />
    }
  ]
}
```

## Accessibility

- Semantic HTML (table structure)
- Keyboard navigation (button focus states)
- Color contrast (WCAG AA)
- Icon + text labels

## Performance

- Memoized filter operations
- No unnecessary re-renders
- Custom scrollbar (lightweight)
- Framer Motion for smooth animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Files to Reference

- Component: `design-arena.tsx` or `.jsx`
- Styling: Tailwind CSS (inline classes)
- Icons: lucide-react package
- Animation: framer-motion package
