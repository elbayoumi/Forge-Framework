# Forge

A semantic compiler that transforms JavaScript UI declarations into native application code at build time.

## What is Forge?

Forge is a multi-stage compiler that performs semantic analysis on JavaScript UI code and generates native applications. It does not execute JavaScript at runtime, use WebViews, or employ cross-platform bridges. Instead, it extracts semantic intent from UI declarations and generates native code that implements that intent.

The compilation process:

1. Parse JavaScript UI declarations into an abstract syntax tree
2. Extract semantic meaning (what components represent, not how they execute)
3. Generate a semantic bundle (intermediate representation)
4. Produce native code from the semantic bundle

The output is indistinguishable from hand-written native applications.

## Why Forge Exists

**Runtime JavaScript is problematic:**

JavaScript engines add megabytes to application size, consume memory, and introduce performance overhead. Even with JIT compilation, JavaScript execution is slower than native code for UI rendering. Runtime engines also create security attack surfaces through dynamic evaluation capabilities.

**WebViews are not native:**

WebView-based solutions render HTML/CSS, not native UI components. This results in non-native appearance, accessibility problems, and performance issues. WebViews cannot access platform APIs without bridges.

**Cross-platform bridges add complexity:**

Solutions that bridge JavaScript to native code require maintaining synchronization between two execution environments. This creates debugging complexity, performance bottlenecks at the bridge boundary, and version compatibility problems.

**Compile-time semantic compilation is different:**

Forge analyzes UI intent at build time and generates native code. There is no JavaScript runtime, no WebView, and no bridge. The generated application is pure native code that uses platform-standard UI frameworks (Jetpack Compose for Android).

## How Forge Works

**Pipeline:**

```
JavaScript UI → AST Parser → Semantic Analyzer → Semantic Bundle → Native Code Generator → Native Project
```

**Deterministic builds:**

Identical input produces identical output. No timestamps, random values, or system-dependent data appear in generated code. Builds are reproducible across machines and time.

**Inspectable artifacts:**

Every stage produces explicit artifacts:

- `.forge/semantic/semantic.json` - Semantic bundle (human-readable JSON)
- `.forge/native/android/` - Generated Android project (standard Gradle)

All artifacts can be inspected, modified, and re-compiled. There are no hidden transformations.

## Quick Start (5 Minutes)

**1. Create project structure:**

```
my-app/
└── src/
    └── ui.js
```

**2. Write UI declaration in `src/ui.js`:**

```javascript
ui(column(text("Hello Forge"), button("Click Me", handleClick)));
```

**3. Generate semantic bundle:**

```bash
forge build web
```

Output: `.forge/semantic/semantic.json`

**4. Generate Android project:**

```bash
forge build android
```

Output: `.forge/native/android/` (complete Gradle project)

**5. Build Android APK:**

```bash
cd .forge/native/android
./gradlew assembleDebug
```

The generated `MainActivity.kt` contains:

```kotlin
@Composable
fun MainScreen() {
    Column {
        Text(text = "Hello Forge")
        Button(onClick = { Log.d("ForgeApp", "Button clicked: handleClick") }) {
            Text(text = "Click Me")
        }
    }
}
```

## CLI Commands

**forge build web**

Parses `src/ui.js` and generates semantic bundle at `.forge/semantic/semantic.json`.

**forge build android**

Reads semantic bundle and generates Android Gradle project at `.forge/native/android/`.

Requires semantic bundle to exist (run `forge build web` first).

**forge inspect ui**

Displays UI component tree from semantic bundle.

Example output:

```
UI Tree:

column
  text {"content":"Hello Forge"}
  button {"label":"Click Me","action":"handleClick"}
```

**forge inspect semantic**

Displays complete semantic bundle as formatted JSON.

## Inspector

The inspector provides read-only access to semantic artifacts. This serves two purposes:

**Trust:** Developers can verify what Forge generates. No hidden transformations occur. The semantic bundle is the complete intermediate representation.

**Debugging:** When generated code behaves unexpectedly, developers can inspect the semantic bundle to determine if the issue is in parsing (web builder) or code generation (native compiler).

Inspector commands never modify files. They are pure read operations.

## What Forge Is NOT

Forge is explicitly not:

- A JavaScript framework (React, Vue, Angular)
- A runtime engine (no JavaScript executes on device)
- A cross-platform framework (React Native, Flutter, Ionic)
- A WebView wrapper (Cordova, Capacitor)
- A bundler or build tool (Webpack, Vite)
- A UI component library

Forge is a compiler. It transforms source code at build time and produces native applications.

## Current Limitations (v0.1)

**Platform support:**

- Android only (Jetpack Compose)
- iOS, Web, Desktop not yet supported

**UI components:**

- Four components only: text, button, column, row
- No images, inputs, lists, or custom components

**Features not supported:**

- Navigation between screens
- State management
- User input handling (beyond button clicks)
- Styling or theming
- Animations
- Network requests
- Conditional rendering
- Dynamic lists

**Semantic model:**

- Static UI declarations only
- No runtime behavior modeling
- No data binding

These are current implementation limitations, not fundamental constraints. The architecture supports these features in future versions.

## Roadmap (High-Level)

**v0.2 (Next):**

- Conditional rendering support
- List rendering
- Basic state management primitives
- Navigation between screens

**Future:**

- iOS compiler (SwiftUI code generation)
- Expanded semantic model (actions, effects)
- Web compiler (framework-agnostic output)
- Desktop compilers (Qt, native)
- Enhanced inspector (semantic validation, visualization)

## Technical Details

**Dependencies:**

- Babel (AST parsing)
- TypeScript (compiler implementation)
- No runtime dependencies in generated code

**Generated code:**

- Standard Gradle projects (Android)
- No custom build plugins or tooling required
- Uses platform-standard UI frameworks
- No Forge-specific runtime libraries

**Semantic bundle format:**

JSON representation of UI structure, state model, action model, and design tokens. Documented in `forge-core` type definitions.

## Contributing

Forge is architecture-first. Contributions must maintain:

1. Deterministic builds (no random or time-dependent output)
2. Compile-time guarantees (no runtime execution)
3. Inspectable artifacts (no hidden transformations)
4. Test coverage for all code paths

## License

MIT
