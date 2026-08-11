# 📝 DualTask: Vanilla JS Notes & Timer

A lightweight productivity app combining a persistent notes system and a multifunctional timer, built entirely with Vanilla JavaScript and designed around mobile and desktop interactions.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

This project was built as a practical exercise in Vanilla JavaScript, focusing on state management, DOM manipulation, browser persistence, timer control, responsive interactions, and input handling across different devices.

The application combines two independent modes: a persistent Notes interface and a Timer supporting both stopwatch and countdown behavior.

## ✨ Features

* **Dual Mode Interface:** Switch between a persistent Notes mode and a Timer mode without leaving the application.
* **Notes Management:** Create, edit, and delete notes with their contents stored in `localStorage`. Notes receive unique IDs and are dynamically rendered into the interface.
* **Stopwatch & Countdown Timer:** The timer supports both count-up and countdown modes, with controls for starting, pausing, resuming, and resetting the current timer.
* **Timestamp System:** Stopwatch sessions can record timestamps through different input methods depending on the device, including the `Spacebar` on desktop and swipe gestures on touch devices.
* **Responsive Input Handling:** The application detects the current input type and provides different interaction methods for mouse and touch devices.
* **Mobile Gestures:** Touch interactions include swipe gestures for timer editing and long-press interactions for editing notes.
* **Desktop Interactions:** Desktop users can edit notes through double-clicks and create stopwatch timestamps using the `Spacebar`.
* **Floating Timer Display:** The `NowBar` provides a compact timer display that can remain visible while navigating between application modes.
* **Animated Timer Feedback:** Countdown mode uses animated visual indicators to represent the timer's progress, while stopwatch mode provides continuous visual feedback.
* **Persistent Preferences:** Notes, selected mode, theme, and tutorial states are stored through the browser's `localStorage`.
* **Interactive Tutorials:** First-use guidance is provided for features such as note editing, timestamps, timer editing, and switching timer modes.
* **Dark & Light Themes:** The interface supports theme switching through a DOM-level `data-theme` attribute.

## 🛠️ Technologies Used

* **Vanilla JavaScript (ES6+):** Application state, timer logic, note management, DOM rendering, persistence, input detection, gestures, and UI interactions.
* **CSS3:** CSS variables, responsive layouts, state-based classes, animations, and dynamic visual feedback.
* **HTML5:** Structural application markup and interactive elements.
* **Web Storage API:** Uses `localStorage` to persist notes, preferences, and tutorial progress.
* **Browser Timing APIs:** Uses `performance.now()` and `setInterval()` for timer tracking and periodic state updates.

---

## 🏗️ Application Structure

The current implementation uses JavaScript objects as functional namespaces to group related responsibilities.

| Component | Responsibility |
|---|---|
| `appConfig` | Application initialization and global setup |
| `appState` | Shared timer state and value subscriptions |
| `modos` | Switching and managing application modes |
| `temas` | Theme state and persistence |
| `modoNotas` | Notes UI state and interface management |
| `createNotas` | Note creation, editing, deletion, persistence, and rendering |
| `timerConfig` | Stopwatch/countdown logic and timer lifecycle |
| `visorUI` | Timer display and stopwatch/countdown switch |
| `botaoTimer` | Timer controls and button states |
| `nowBar` | Floating timer display |
| `setGestures` | Touch gesture detection |
| `setInputs` | Mouse and keyboard interaction handling |
| `tutorialManager` | First-use tutorials and tutorial persistence |
| `helperFunctions` | Shared DOM, animation, formatting, and timing utilities |

This structure keeps related functionality grouped, but several components currently share state and directly manipulate each other's UI, making further separation a natural next step.

---

## 🚀 Possible Improvements

This is an older project, and reviewing the current implementation reveals several areas where the architecture could be improved.

* **Separate State from UI:** `modoNotas`, `visorUI`, `botaoTimer`, `nowBar`, and other objects currently combine application state, DOM references, rendering, and behavior. Separating state management from presentation would make the code easier to reason about and test.

* **Split the JavaScript into Modules:** The current implementation is concentrated in a single JavaScript file containing many objects with different responsibilities. Moving these components into ES6 modules would make dependencies more explicit and reduce the size and complexity of individual files.

* **Standardize Naming:** The code currently mixes Portuguese and English identifiers such as `appState`, `timerConfig`, `modoNotas`, `criarTimestamp`, and `setGestures`. Renaming the remaining Portuguese identifiers to English would make the codebase more consistent.

* **Reduce Shared Mutable State:** Several objects directly access and modify state owned by other objects. Introducing clearer state boundaries would reduce coupling between the timer, notes, UI, and interaction systems.

* **Refactor the Timer Architecture:** Timer state, timing calculations, UI updates, animations, and controls are currently distributed across multiple objects. A more centralized timer model with a dedicated renderer could simplify the lifecycle of `stop`, `running`, `paused`, `edit`, and `finished` states.

* **Improve Input Abstraction:** Mouse and touch interactions are currently handled by separate systems. A unified pointer-based interaction layer could reduce duplicated logic while still supporting device-specific behaviors when necessary.

* **Simplify Animation Management:** Animation helpers currently rely on fixed delays in several places. Using `animationend` events or a more centralized animation controller could reduce timing assumptions and make UI transitions more predictable.

* **Improve Data Validation:** Data loaded from `localStorage` is parsed and used directly in several places. A small persistence layer with validation and fallback defaults would make corrupted or outdated stored data easier to handle.

* **Refactor DOM Creation:** A significant amount of UI is generated manually through repeated `createElement`, `appendChild`, and class manipulation calls. A more consistent rendering strategy could reduce repetitive DOM code.

* **Improve Testing:** Core functionality such as timer calculations, note persistence, mode switching, and gesture interpretation could be extracted into smaller pure functions and tested independently from the DOM.

* **Remove Experimental and Legacy Code:** The code contains commented-out functionality, experimental behavior, and temporary implementations such as vibration calls and test timer values. Cleaning these sections would make the final codebase easier to maintain.

* **Improve State Modeling:** Values such as `"stop"`, `"running"`, `"paused"`, `"edit"`, and `"finished"` are represented as strings throughout the application. Replacing these with centralized constants or a clearer state model would reduce the possibility of inconsistent state values.

* **Decouple Persistence from Features:** `localStorage` operations are currently performed directly inside feature-specific objects. A dedicated storage module could centralize serialization, retrieval, validation, and persistence logic.

* **Refactor the Tutorial System:** Tutorials currently interact directly with application components and persist their own state. Separating tutorial content, tutorial state, and tutorial presentation would make the system easier to extend.
