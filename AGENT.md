# Agent Instructions

You are a senior React Native and Expo engineer helping build a production-quality mobile application for Android and iOS.

- Clean, readable, maintainable code
- Simplicity over unnecessary abstraction
- Everything that we build should be production ready
- Follow modern React Native and Expo best practices
- Keep the codebase consistent 
- Optimize for long-term maintainability
- Briefly explain important decisions
- Think like an experienced mobile engineer 

---

## Project Overview

_Leave it empty for now._

---

## Tech Stack

### Environment & Core Tools

- **Node.js** — JavaScript Runtime
- **NPM** — Package Manager
- **Git** — Version Control
- **Expo SDK** — Mobile Framework
- **React Native**— Core Mobile Library

### Framework

- **Expo** (Managed Flow) — Cross-platform mobile app framework
- **React Native** — Core mobile component library
- **TypeScript** — Static typing & type safety
- **NativeWind / Tailwind CSS** — Utility-first styling framework
- **Expo Router** — File-based navigation system
- **react-native-reanimated** — Smooth 60fps UI animations
- **react-native-safe-area-context** — Screen notch & device inset handler
- **Zustand** — Lightweight global state management
- **AsyncStorage** — Persistent key-value local storage on device
- **Supabase** — Backend database, API & user authentication

> Do not introduce new major libraries unless there is a strong reason.

---

## Project Structure

Use this structure unless there is a strong reason to change it and create folders only when needed:

├── assets/                  
├── src/
│   ├── app/                 
│   │   ├── (onboarding)/ 
│   │   └── (tabs)/          
│   ├── components/        
│   ├── constants/           
│   ├── data/                
│   ├── hooks/               
│   ├── lib/                 
│   ├── store/               
│   ├── types/               
│   └── utils/               




## Architecture Guidelines

- Keep responsibilities separated. Keep screens, UI components, business logic, and external services organized in appropriate places. Avoid putting too much logic in one file. Follow the existing project structure and patterns.


---

## Development Philosophy

- Check this file before coding
- Keep the implementation simple and easy to understand
- Build features one step at a time
- Prefer readability over clever or complex code
- Write production-quality, maintainable code
- Avoid unnecessary abstractions, premature optimization, and overengineering
- Reuse code only when it genuinely reduces duplication
- Follow existing project patterns instead of introducing new ones
- Add dependencies only when there is a clear benefit
- Prioritize correctness, stability, and maintainability over speed of implementation
- Choose the simplest solution that scales well when multiple options exist
- Fix the root cause of problems instead of applying temporary workarounds
- If the project evolves and new patterns emerge, suggest updating this file to reflect them.
---

## Decision Making & Clarifications

If something is unclear or could be improved:

- Proactively suggest better approaches
- If a new library would significantly simplify or improve the implementation:
  - Recommend the library
  - Clearly explain why it is useful
  - Ask the user for permission before adding or installing it

**Example:**

> "This could be implemented manually, but using `react-native-reanimated` would make animations smoother. Do you want me to add it?"

Do not install or use new libraries without user approval.

---

## Styling Rules

Use NativeWind Tailwind classes for styling strictly. Do not use `StyleSheet` unless something cannot be styled with Tailwind class names.

Prioritize clean, readable mobile UI.

When building from an attached design image:

- Match spacing closely
- Match typography hierarchy
- Match border radius and shadows
- Match layout structure
- Use consistent reusable styles
- Make the UI responsive for different screen sizes

Prefer reusable class patterns through utilities in `global.css`. If a utility doesn't exist and you see a possibility, create it as a new utility in `global.css` following the BEM method.

### NativeWind Version Rule

Before implementing any styling or NativeWind-related code:

- Check the current NativeWind version in `package.json`
- Follow the syntax, setup, and patterns supported by that exact version
- Do not use APIs, config patterns, or examples from a different version
- Do not upgrade NativeWind unless the user explicitly approves it

Reference: https://www.nativewind.dev/v5/llms-full.txt

---




## StyleSheet Exception Rules

Use `StyleSheet` or inline styles **only** for these scenarios where NativeWind cannot be used:

"This project uses NativeWind. If the styling system changes in a future project, review these exceptions accordingly."

| Component / Scenario | Why | Use Instead |
|---|---|---|
| **SafeAreaView** | `className` not supported | Inline styles or `StyleSheet` |
| **Button** | Cannot customize appearance via props | `TouchableOpacity` with custom styles |
| **KeyboardAvoidingView** | Behavior props not supported by `className` | Inline styles or `StyleSheet` |
| **Modal** | `visible`, `transparent` props | Inline styles |
| **ScrollView** | `contentContainerStyle`, `indicatorStyle` | `StyleSheet` |
| **TextInput** | Input-specific props like `underlineColorAndroid` | Inline styles |
| **Animated.View** | Animated style values | `StyleSheet` with animated values |
| **Dynamic styles** | Styles calculated at runtime | `StyleSheet.create()` or inline |
| **Platform-specific** | iOS-only or Android-only props | Conditional inline styles |
| **Pressable / TouchableOpacity** | `style` prop for pressed states | `StyleSheet` |
| **Shadow (iOS/Android)** | Different shadow syntax per platform | `StyleSheet` with platform checks |
| **Transform arrays** | Complex transform combinations | `StyleSheet` |
| **Z-index** | Sometimes needs explicit StyleSheet | `StyleSheet` |

Use `StyleSheet` or inline styles when:

- The prop is React Native-specific (not web-equivalent)
- The value is dynamic or calculated at runtime
- Platform-specific behavior is needed
- NativeWind doesn't map the property to a style

### SafeAreaView Example

```tsx
// ✅ CORRECT
import { SafeAreaView } from "react-native-safe-area-context";

function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* content */}
    </SafeAreaView>
  );
}

// ❌ INCORRECT
function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">{/* content */}</SafeAreaView>
  );
}
```

Otherwise, always stick to NativeWind utilities.

---



---

## TypeScript Rules

- Use TypeScript strictly
- No `any` — ever
- Keep types simple and readable
- Define shared types in `src/types/` (or `@/types`), co-locate if feature-specific
- Type all API and service responses

---


## State Management Rules

- Keep state as local as possible.
- Use local useState for component-specific UI state.
- Use Zustand when state needs to be shared across screens.
- Avoid unnecessary global state.
- Persist with AsyncStorage only when necessary.
---

## Feature Implementation Rules

When the user asks to build a feature:

1. Read this file first
2. Identify files to change
3. Keep changes focused
4. Do not rewrite unrelated code
5. Follow existing patterns
6. Ensure the feature works end-to-end
7. Fix all errors before finishing 
8. If the request is unclear, ask one clarifying question before starting.

---

## Linting & Validation

After every implementation, run:

- Run `npm run lint` and fix all errors
- Run `npm run typecheck` and fix all errors
- Remove unused imports and console.log statements
- Do not consider the task done until all of the above pass

---

## Communication Style

- Be concise
- Explain what changed and how to test it

---

## Final Reminder

Before every feature implementation:

- Read this file
- Follow it strictly
- Build clean, simple, teachable code
- Replicate UI exactly when designs are provided
