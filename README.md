# Forge

A semantic compiler that transforms JavaScript UI declarations into native application code at build time.

## What is Forge?

Forge is a **compiler**, not a framework or runtime.

It parses JavaScript UI declarations, extracts semantic intent, and generates native code. The JavaScript you write is **never executed**—it is analyzed at build time to understand what UI you want, then discarded. The output is pure native code.

**Critical distinction:** Forge does not run JavaScript. It reads JavaScript as a declarative DSL (domain-specific language) to understand UI structure, then generates equivalent native code. The generated application contains zero JavaScript.

### Compilation Pipeline

```
JavaScript UI → AST Parser → Semantic Analyzer → Semantic Bundle → Native Code Generator → Native Project
```

1. **Parse:** JavaScript UI declarations are parsed into an abstract syntax tree
2. **Analyze:** Semantic meaning is extracted (what components represent, not how they execute)
3. **Bundle:** A semantic bundle (intermediate representation) is generated
4. **Generate:** Native code is produced from the semantic bundle

The output is indistinguishable from hand-written native applications.

## What Forge Is NOT

**Forge is NOT a JavaScript framework:**

- Not React, Vue, Angular, or similar
- Does not use virtual DOM, reconciliation, or component lifecycle
- JavaScript is a compile-time DSL only, not runtime code

**Forge is NOT a runtime engine:**

- No JavaScript engine ships with your app
- No V8, JavaScriptCore, or Hermes
- No dynamic code execution on device

**Forge is NOT a cross-platform framework:**

- Not React Native (no Metro bundler, no bridge)
- Not Flutter (no Dart, no custom rendering engine)
- Not Ionic/Capacitor (no WebView)

**Forge is NOT a WebView wrapper:**

- Does not render HTML/CSS
- Does not use Cordova, Capacitor, or similar
- No web-to-native bridge

**Forge is NOT a bundler:**

- Not Webpack, Vite, Rollup, or esbuild
- Does not bundle JavaScript for runtime execution
- Generates native code, not JavaScript bundles

**Forge IS a compiler:**

- Transforms source code at build time
- Produces native applications
- No runtime dependencies beyond platform SDKs

## Why Forge Exists

**Problem:** Runtime JavaScript engines add megabytes to app size, consume memory, and introduce performance overhead. WebViews render HTML/CSS instead of native UI. Cross-platform bridges create synchronization complexity and debugging difficulties.

**Solution:** Compile-time semantic analysis. Forge analyzes UI intent at build time and generates native code. No JavaScript runtime, no WebView, no bridge. The generated application is pure native code using platform-standard UI frameworks (Jetpack Compose for Android).

## DSL Limitations (Important)

The JavaScript you write for Forge is **not normal JavaScript**. It is a restricted declarative DSL.

**Allowed:**

```javascript
ui(column(text("Hello"), button("Click", handleClick)));
```

**NOT allowed:**

```javascript
// No arrays
const items = [1, 2, 3];

// No JSX
<Column><Text>Hello</Text></Column>

// No variables
const greeting = "Hello";
ui(text(greeting));

// No loops
for (let i = 0; i < 10; i++) { ... }

// No conditionals
if (condition) { ... }

// No functions
function MyComponent() { ... }
```

**Why these restrictions?**

Forge performs **static semantic analysis**. It must understand UI structure at compile time without executing code. Variables, loops, and conditionals require runtime execution, which Forge explicitly does not do.

These are v0.1 limitations. Future versions will support conditional rendering and list rendering through semantic primitives (not runtime JavaScript execution).

## Current Scope (v0.1)

**Platform support:**

- ✅ Android (Jetpack Compose)
- ❌ iOS (not yet implemented)
- ❌ Web (not yet implemented)
- ❌ Desktop (not yet implemented)

**UI components:**

- ✅ `text()` - Display text
- ✅ `button()` - Clickable button
- ✅ `column()` - Vertical layout
- ✅ `row()` - Horizontal layout
- ❌ Everything else (images, inputs, lists, custom components)

**Features NOT supported:**

- Navigation between screens
- State management
- User input (text fields, forms)
- Styling or theming
- Animations
- Network requests
- Conditional rendering
- Dynamic lists
- Data binding
- Props or component composition

**What you CAN build in v0.1:**

- Static UI layouts with text and buttons
- Proof-of-concept applications
- Compiler pipeline demonstrations

**What you CANNOT build in v0.1:**

- Real applications
- Anything with user input beyond button clicks
- Anything with dynamic content
- Anything with navigation

v0.1 is a **compiler architecture demonstration**, not a production-ready framework.

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

**forge build**

Runs web build, then android build (if web succeeds).

**forge build web**

Parses `src/ui.js` and generates semantic bundle at `.forge/semantic/semantic.json`.

**forge build android**

Reads semantic bundle and generates Android Gradle project at `.forge/native/android/`.

Requires semantic bundle to exist (run `forge build web` first).

**forge inspect ui**

Displays UI component tree from semantic bundle.

Example output:

```
[forge] UI tree:

ui
  column
    text {"content":"Hello Forge"}
    button {"label":"Click Me","action":"handleClick"}
```

**forge inspect semantic**

Displays complete semantic bundle as formatted JSON.

**forge help**

Shows usage information and examples.

## Inspector

The inspector provides read-only access to semantic artifacts.

**Purpose:**

- **Trust:** Verify what Forge generates. No hidden transformations.
- **Debugging:** Determine if issues are in parsing (web builder) or code generation (native compiler).

Inspector commands never modify files. They are pure read operations.

## How Forge Works

**Deterministic builds:**

Identical input produces identical output. No timestamps, random values, or system-dependent data appear in generated code. Builds are reproducible across machines and time.

**Inspectable artifacts:**

Every stage produces explicit artifacts:

- `.forge/semantic/semantic.json` - Semantic bundle (human-readable JSON)
- `.forge/native/android/` - Generated Android project (standard Gradle)

All artifacts can be inspected, modified, and re-compiled. There are no hidden transformations.

**No runtime dependencies:**

Generated applications use only platform-standard SDKs. No Forge-specific libraries are required at runtime.

## Roadmap

**v0.2 (Next):**

- Conditional rendering (semantic primitives, not runtime JS)
- List rendering (semantic primitives, not runtime JS)
- Basic state management
- Navigation between screens

**Future:**

- iOS compiler (SwiftUI code generation)
- Web compiler (framework-agnostic output)
- Desktop compilers (Qt, native)
- Expanded semantic model (actions, effects)
- Enhanced inspector (validation, visualization)

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

## Frequently Asked Questions

**Q: Why not just use React Native?**

A: React Native runs JavaScript at runtime and uses a bridge to communicate with native code. Forge generates native code at build time. No JavaScript runtime, no bridge, no synchronization overhead.

**Q: Why not just use Flutter?**

A: Flutter uses a custom rendering engine and Dart runtime. Forge generates platform-standard native code (Jetpack Compose, SwiftUI). No custom runtime, no framework-specific rendering.

**Q: Can I use npm packages?**

A: No. Forge does not execute JavaScript. npm packages are runtime libraries. Forge only reads JavaScript as a declarative DSL.

**Q: Can I write normal JavaScript functions?**

A: No. Forge performs static semantic analysis. It does not execute code. The JavaScript you write is a restricted DSL, not executable code.

**Q: When will this be production-ready?**

A: Not soon. v0.1 is a compiler architecture demonstration. Production readiness requires expanded semantic models, more platforms, comprehensive component libraries, and extensive testing.

**Q: Why use JavaScript if it's not executed?**

A: Familiarity. Developers know JavaScript syntax. Using JavaScript as a compile-time DSL lowers the learning curve compared to inventing a new syntax.

**Q: Is this better than native development?**

A: No. v0.1 is far worse than native development. The value proposition is compile-time semantic analysis enabling future cross-platform code generation without runtime overhead. This is a long-term architectural bet, not a current productivity win.

## License

MIT
