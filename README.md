# 📝 Notas & Timer App

Dual-mode productivity web app with smooth animations

🚨 WORK IN PROGRESS ALERT: This is an ongoing personal project with messy code, minimal documentation, and experimental features. Not production-ready!

---

# 📱 What's This?

A mobile-first web app that combines note-taking and time tracking in one seamless interface. Switch between modes with smooth animations and enjoy a polished, gesture-driven UX.

Why I built this:

· To master complex state management without frameworks
· To push CSS animations and transitions to the limit
· To create a genuinely useful productivity tool for myself
· To learn mobile gesture handling and touch events

# ✨ Current Features (Working)

· 📝 Notes Mode: Create, edit, delete notes with animations
· ⏱️ Timer Mode: Stopwatch with lap timestamps
· 🔄 Dual-Mode Interface: Switch seamlessly between modes
· 📱 Mobile-First Design: Touch gestures, haptic feedback
· 💾 Local Storage: Notes persist between sessions
· 🎨 Smooth Animations: Coordinated CSS/JS transitions
· ✨ UI Feedback: Visual and haptic responses

# 🚧 What's Broken/Needs Work

This project is in active development! Here's the current state:

Known Issues:

· 🐛 Code organization: Everything in one file (monolithic mess)
· 🎨 CSS spaghetti: Hardcoded values, no variables
· 📱 Responsive quirks: Some layout issues on specific screens
· 🔧 Memory leaks: Event listeners not always cleaned up
· 🧪 Experimental features: Some animations are janky

What I'm Actively Improving:

1. Animations: Making them smoother and more performant
2. Design/UX: Overhauling the visual hierarchy and interactions
3. Dark Mode: Implementing a proper theme system
4. Code Structure: Splitting into modules, better architecture

# 🛠️ Tech Stack

Technology Purpose Status
Vanilla JavaScript Core logic, state management ✅ Stable
CSS3 Animations, layout, visual design 🔄 Refactoring
HTML5 Semantic structure ✅ Complete
LocalStorage API Data persistence ✅ Working
Touch Events Mobile gestures ✅ Implemented
Vibration API Haptic feedback ✅ Working

# 📁 Project Structure (Current Mess)

```
/
├── index.html              # Main HTML (minimal)
├── style.css               # ALL styles (needs splitting!)
├── script.js               # ALL JavaScript (needs modularization!)
└── README.md               # This file
```

Yep, it's all in one file right now. I'm planning to refactor into proper modules.

# 🎮 How to Use

Notes Mode:

· Tap pen icon to create new note
· Tap note to expand/collapse (reveals delete button)
· Long press note (1.2s) to edit (note will shake)
· Swipe? Not implemented yet

Timer Mode:

· Start/Pause/Reset with bottom buttons
· Swipe right anywhere to create timestamp
· Timestamps auto-clear when timer resets

Switching Modes:

· Tap the clock/note icon in top-right to switch
· Smooth transition animation between modes

# 🔧 Technical Implementation

Architecture Overview:

```javascript
// Three main modules (currently in one file)
const modosSwitch = { /* Mode switcher controller */ };
const modoNotas = { /* Complete notes system */ };
const modoTimer = { /* Complete timer system */ };
```

# Key Technical Challenges Solved:

1. State Synchronization: Keeping UI in sync across mode switches
2. Animation Coordination: Using async/await to sequence animations
3. Touch Gestures: Long press detection with timeout management
4. Performance: will-change, transform optimizations
5. Mobile UX: Haptic feedback, touch-friendly targets

# 🎯 Why This Project is Special

What Makes It Different:

· ✅ No frameworks - Pure vanilla implementation
· ✅ Complex animations coordinated between CSS and JS
· ✅ Real mobile gestures with proper feedback
· ✅ Attention to detail in micro-interactions
· ✅ Performance conscious from the start

Technical Highlights:

```javascript
// 1. Async animation coordination
async function gerenciarAnimacao(el) {
  if(el?.classList.contains("oculto")) {
    await animarEntrada(el);
  } else {
    await animarSaida(el);
  }
}

// 2. Touch gesture with multiple states
let startTouchTime = 0;
let holdTimer;
// Long press detection with visual feedback

// 3. State management without external libraries
const modoNotas = {
  notasArray: [],
  ultimoIndexSalvo: null,
  // Full CRUD operations
};
```

# 🚨 Planned Improvements & Roadmap

Phase 1: Immediate Fixes (Current Focus)

· CSS Refactor: Implement CSS Custom Properties (variables)
· Dark Mode: Complete theme system with toggle
· Animation Polish: Smoother transitions, less jank
· Code Splitting: Separate into modules (notes.js, timer.js, ui.js)

Phase 2: UX/UI Overhaul

· Better Gestures: Swipe to delete/archive notes
· Visual Design: Consistent spacing, typography, colors
· Loading States: Skeleton screens for initial load
· Empty States: Better illustrations and messaging
· Accessibility: ARIA labels, keyboard navigation

Phase 3: Feature Additions

· Note Categories/Tags: Organize notes with color coding
· Timer Presets: Save common timer durations
· Export Notes: JSON/PDF export functionality
· Cloud Sync: Optional Firebase integration
· PWA: Installable app with offline support

Phase 4: Polish & Optimization

· Performance Audit: Lighthouse score to 90+
· Bundle Optimization: When modules are split
· Testing: Unit tests for core functionality
· Documentation: JSDoc comments, usage guide

# 🧪 Current Technical Debt

Code Organization:

```javascript
// CURRENT: Everything in ~500 lines of one file
// GOAL: Split into:
// - app.js (main initialization)
// - notes-manager.js (notes logic)
// - timer-manager.js (timer logic)  
// - ui-controller.js (DOM manipulations)
// - animations.js (animation helpers)
// - storage.js (localStorage wrapper)
```

CSS Improvements Needed:

```css
/* CURRENT: Hardcoded values everywhere */
.botaoDeCriacao {
  background-color: #1ac783; /* Hardcoded */
}

/* GOAL: CSS Custom Properties */
:root {
  --primary: #1ac783;
  --secondary: #64c7b2;
  --danger: #d32323;
  --bg-light: #ebeeef;
  --text-dark: #000000;
}

[data-theme="dark"] {
  --primary: #64c7b2;
  --bg-light: #2d2d2d;
  --text-dark: #ffffff;
}
```

# 📈 Learning Goals Through This Project

Already Learned:

· ✅ Complex state management without frameworks
· ✅ CSS animations and performance optimization
· ✅ Mobile touch event handling
· ✅ Async/await for animation sequencing
· ✅ LocalStorage API and data persistence

Currently Learning:

· 🔄 CSS architecture with custom properties
· 🔄 Code modularization patterns
· 🔄 Performance profiling and optimization
· 🔄 Accessibility best practices

Want to Learn Next:

· 📚 Service Workers for PWA capabilities
· 📚 Testing strategies for vanilla JS apps
· 📚 Build tools (Vite, ESBuild) for production
· 📚 Advanced animation libraries (GSAP, Framer Motion)

# 🤝 Contributing & Feedback

This is a personal learning project, but I'm open to suggestions!

If you have ideas for improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Areas where I'd love help:

· CSS architecture and theming
· Animation performance optimizations
· Accessibility improvements
· Code organization suggestions

# 🐛 Reporting Issues

Found a bug or weird behavior?

1. Check if it's already in the "Known Issues" above
2. Open an issue with:
   · What you did
   · What you expected to happen
   · What actually happened
   · Browser and device info

# 📚 Development Notes for Myself

Recent Changes:

· Implemented dual-mode switching system
· Added coordinated exit/enter animations
· Improved touch gesture detection
· Added haptic feedback on supported devices

Next Up:

1. Implement CSS variables for theming
2. Add dark mode toggle
3. Split JavaScript into modules
4. Add swipe gestures for note deletion

Code Quality TODOs:

· Add JSDoc comments to all functions
· Remove unused CSS rules
· Add error handling for localStorage
· Implement proper event listener cleanup

# 🫡 About the Developer

Hey! I'm a frontend developer passionate about:

· Clean, performant vanilla JavaScript
· Smooth, delightful user interfaces
· Mobile-first responsive design
· Learning through building complex projects

This project represents my journey from "just making it work" to "making it work well with good architecture and UX."

---

"The best way to learn is to build something you'll actually use."
That's why I'm building this - and sharing the messy, imperfect journey along the way.
