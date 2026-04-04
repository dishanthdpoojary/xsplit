# 🎨 Tailwind CSS Quick Reference for XSplit

## Color Palette

### Primary Colors
```
Primary (Green):    #10b981    --primary
Secondary (Cyan):   #06b6d4    --secondary  
Accent (Gold):      #f59e0b    --accent
Warning (Red):      #ef4444    --warning
```

### Neutral Colors
```
Slate-50:   #f8fafc (lightest)
Slate-100:  #f1f5f9
Slate-200:  #e2e8f0
Slate-300:  #cbd5e1
Slate-400:  #94a3b8
Slate-500:  #64748b
Slate-600:  #475569
Slate-700:  #334155
Slate-800:  #1e293b (card color)
Slate-900:  #0f172a (dark bg)
Slate-950:  #020617 (darkest)
```

## Commonly Used Classes

### Buttons
```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-danger">Danger Button</button>
<button className="btn-outline">Outline Button</button>
<button className="btn-primary btn-small">Small Button</button>
<button className="btn-primary btn-block">Full Width Button</button>
```

### Cards and Containers
```jsx
<div className="card">Card with styling</div>
<div className="stat-card">Statistic Card</div>
<div className="group-card">Group Card</div>
<div className="split-item">Split Item</div>
```

### Forms
```jsx
<input type="text" className="form-input" />
<select className="form-select">
  <option>Option</option>
</select>
<textarea className="form-textarea"></textarea>
```

### Alerts
```jsx
<div className="alert alert-success">Success alert</div>
<div className="alert alert-warning">Warning alert</div>
<div className="alert alert-danger">Danger alert</div>
```

### Flexbox
```jsx
<div className="flex gap-4">Items with gap</div>
<div className="flex justify-between">Space between</div>
<div className="flex items-center">Vertical center</div>
<div className="flex flex-col">Column layout</div>
```

### Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive grid */}
</div>
```

### Spacing
```
Margin:     m-1, m-2, m-4, m-8 (0.25rem to 2rem)
Margin X:   mx-4 (horizontal)
Margin Y:   my-4 (vertical)
Padding:    p-1, p-2, p-4, p-8
Gap:        gap-2, gap-4, gap-6, gap-8
```

### Text
```jsx
<h1 className="text-4xl font-bold">Heading</h1>
<p className="text-slate-400">Muted text</p>
<span className="text-center">Center text</span>
<div className="text-primary">Primary color text</div>
```

### Shadows & Borders
```jsx
<div className="shadow-lg">Large shadow</div>
<div className="border border-slate-700">Border</div>
<div className="rounded-lg">Rounded corners</div>
<div className="hover:shadow-lg">Hover effect</div>
```

### Responsive Design
```jsx
{/* Mobile first approach */}
<div className="flex flex-col md:flex-row lg:flex-row">
  {/* Stack on mobile, row on medium+ screens */}
</div>
```

### Transitions
```jsx
<div className="transition-all duration-300">
  Smooth transition
</div>

<button className="hover:-translate-y-1 hover:shadow-lg">
  Hover effect
</button>
```

### Display
```jsx
<div className="block">Block element</div>
<div className="inline-block">Inline block</div>
<div className="flex">Flex container</div>
<div className="hidden md:block">Hidden on mobile</div>
```

### Sizing
```
Width:      w-full, w-1/2, w-screen
Height:     h-10, h-40, h-screen
Max-width:  max-w-6xl (container max width)
Min-height: min-h-screen (full screen height)
```

## Component Class Examples

### Button Variations
```jsx
// Primary with hover effect
<button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
  Primary Button
</button>

// Using custom class
<button className="btn-primary">Primary Button</button>

// Small size
<button className="btn-primary btn-small">Small</button>

// Full width (block)
<button className="btn-primary btn-block">Full Width</button>
```

### Card Variations
```jsx
// Basic card
<div className="card">Content</div>

// Stat card
<div className="stat-card">
  <div className="text-slate-400">Label</div>
  <div className="text-3xl font-bold text-primary">Value</div>
</div>

// Group card (clickable)
<div className="group-card cursor-pointer">Content</div>
```

### Form Elements
```jsx
// Input
<input 
  type="text" 
  className="form-input"
  placeholder="Enter text"
/>

// Select
<select className="form-select">
  <option>Choose...</option>
</select>

// Textarea
<textarea 
  className="form-textarea"
  placeholder="Enter message"
/>
```

### Grid Layouts
```jsx
// 4-column grid on lg, 2-column on md, 1-column on sm
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

// Auto-fit columns
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {items.map(item => <div key={item.id}>{item}</div>)}
</div>
```

### Navigation
```jsx
<nav className="sticky top-0 z-100 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
  {/* Navigation content */}
</nav>
```

### Modals/Overlays
```jsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div className="bg-slate-800 rounded-lg p-8">
    Modal content
  </div>
</div>
```

## Responsive Breakpoints Usage

```jsx
// Mobile first (default)
<div className="text-sm">Mobile: small</div>

// Medium screens and up
<div className="md:text-base">Tablet and up: medium</div>

// Large screens and up
<div className="lg:text-lg">Desktop and up: large</div>

// Extra large
<div className="xl:text-xl">Large desktop: extra large</div>

// Combined example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col on mobile, 2 on tablet, 4 on desktop */}
</div>
```

## State Classes

```jsx
{/* Hover */}
<button className="hover:bg-primary hover:shadow-lg">Hover Me</button>

{/* Focus */}
<input className="focus:border-primary focus:ring-1 focus:ring-primary/30" />

{/* Active */}
<button className="active:scale-95">Active</button>

{/* Disabled */}
<button disabled className="opacity-50 cursor-not-allowed">Disabled</button>

{/* Group hover (parent) */}
<div className="group hover:bg-slate-700">
  <span className="group-hover:text-primary">Changes on parent hover</span>
</div>
```

## Dark Mode Friendly

All classes use dark-friendly colors:
- Dark backgrounds (slate-900, slate-800)
- Light text (slate-100, slate-50)
- Primary accents (green, cyan)
- Good contrast ratios

## Performance Tips

1. **Use utility classes** instead of custom CSS
2. **Avoid arbitrary values** in production
3. **Use responsive classes** for mobile-first design
4. **Leverage state classes** for interactivity
5. **Group related classes** for readability

## Common Patterns in XSplit

### Layout
```jsx
<div className="container mx-auto px-8 py-8 max-w-6xl">
  {/* Page content */}
</div>
```

### Header Section
```jsx
<div className="mb-8">
  <h1 className="text-4xl font-bold text-slate-100 mb-2">Title</h1>
  <p className="text-slate-400">Subtitle</p>
</div>
```

### Stats Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map(stat => (
    <div key={stat.id} className="stat-card">
      <div className="text-slate-400">{stat.label}</div>
      <div className="text-3xl font-bold text-primary">{stat.value}</div>
    </div>
  ))}
</div>
```

### Item List
```jsx
<div className="space-y-4">
  {items.map(item => (
    <div key={item.id} className="expense-item">
      {/* Item content */}
    </div>
  ))}
</div>
```

### Form Grid
```jsx
<form className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className="block text-slate-100 font-medium mb-2">Label</label>
      <input className="form-input" type="text" />
    </div>
    {/* More fields */}
  </div>
  <button className="btn-primary btn-block">Submit</button>
</form>
```

---

**Pro Tip**: Use VS Code's Tailwind CSS IntelliSense extension for autocomplete!
